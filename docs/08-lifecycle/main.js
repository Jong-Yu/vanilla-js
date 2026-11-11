import { createSwitchStore } from "../shared/switch-store.js";
import { bindSwitch } from "../shared/bind-switch.js";

const input = document.querySelector("#notifications");
const form = document.querySelector("#settings");
const summary = document.querySelector("#summary");
const notifyCount = document.querySelector("#notify-count");
const connection = document.querySelector("#connection");
const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#disconnect");
const formResult = document.querySelector("#form-result");
const store = createSwitchStore(input.defaultChecked);
let cleanupConnection = null;
let notifications = 0;

function showState() {
  summary.textContent = store.getState().checked ? "켜짐" : "꺼짐";
  notifyCount.textContent = String(notifications);
}

// 화면의 저장소 표시 구독은 유지하고, 입력과의 연결만 붙였다 떼어봅니다.
store.subscribe(() => {
  notifications += 1;
  showState();
});

function showConnection() {
  const connected = cleanupConnection !== null;
  connection.textContent = connected ? "연결됨" : "연결 해제됨";
  connectButton.disabled = connected;
  disconnectButton.disabled = !connected;
}

function connect() {
  if (cleanupConnection) return; // 중복 연결 방지
  const unbind = bindSwitch(input, store);
  let active = true;
  let resetTimer;

  function handleReset(event) {
    // 다음 작업으로 미뤄 브라우저의 기본 reset이 끝난 값을 읽습니다.
    // microtask는 이벤트의 기본 동작보다 먼저 실행될 수 있습니다.
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      if (!active || event.defaultPrevented) return;
      store.setChecked(input.checked);
    }, 0);
  }

  form.addEventListener("reset", handleReset);
  cleanupConnection = () => {
    // 입력의 change 이벤트, 저장소 구독, 폼의 reset 이벤트 연결을 모두 해제합니다.
    active = false;
    clearTimeout(resetTimer);
    unbind();
    form.removeEventListener("reset", handleReset);
  };
  showConnection();
}

function disconnect() {
  if (!cleanupConnection) return;
  cleanupConnection();
  cleanupConnection = null;
  showConnection();
}

connectButton.addEventListener("click", connect);
disconnectButton.addEventListener("click", disconnect);
form.addEventListener("submit", (event) => {
  event.preventDefault(); // 이 실습에서는 서버로 전송하지 않고 값만 확인합니다.
  formResult.textContent = JSON.stringify([...new FormData(form).entries()], null, 2);
});

connect();
showState();
