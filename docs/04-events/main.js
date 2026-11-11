const button = document.querySelector("#nested-button");
const wrapper = document.querySelector("#event-zone");
const stopBubbling = document.querySelector("#stop-bubbling");
const eventLog = document.querySelector("#event-log");
const clearLogButton = document.querySelector("#clear-log");

function logClick(event) {
  // target은 출발점, currentTarget은 지금 실행 중인 리스너가 붙은 요소입니다.
  const targetId = event.target.id;
  const listenerId = event.currentTarget.id;
  eventLog.textContent += `${event.type} | target: #${targetId} | currentTarget: #${listenerId}\n`;
}

button.addEventListener("click", (event) => {
  logClick(event);

  if (stopBubbling.checked) {
    event.stopPropagation();
    eventLog.textContent += "→ 버튼에서 전파를 멈췄습니다.\n";
  }
});

wrapper.addEventListener("click", logClick);

clearLogButton.addEventListener("click", () => {
  eventLog.textContent = "";
});

const form = document.querySelector("#message-form");
const submitResult = document.querySelector("#submit-result");
let submitCount = 0;

function handleSubmit(event) {
  // 폼 제출의 기본 동작인 데이터 전송과 페이지 이동을 취소합니다.
  event.preventDefault();

  const input = event.currentTarget.querySelector("#message");
  submitCount += 1;
  submitResult.textContent = `submit ${submitCount}회 · "${input.value}"를 읽었습니다. 페이지는 이동하지 않습니다.`;
}

form.addEventListener("submit", handleSubmit);

const checkbox = document.querySelector("#email-notifications");
const changeResult = document.querySelector("#change-result");
let changeCount = 0;

checkbox.addEventListener("change", (event) => {
  // 브라우저가 변경을 마친 뒤이므로 새 checked 값을 읽습니다.
  changeCount += 1;
  changeResult.textContent = `change ${changeCount}회 · checked: ${event.currentTarget.checked}`;
});
