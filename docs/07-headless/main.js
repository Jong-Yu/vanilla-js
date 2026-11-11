import { createSwitchStore } from "../shared/switch-store.js";
import { bindSwitch } from "../shared/bind-switch.js";

const store = createSwitchStore(false);
const plainInput = document.querySelector("#plain");
const styledInput = document.querySelector("#styled");
const summary = document.querySelector("#summary");
const stateView = document.querySelector("#state-view");
const notifyCount = document.querySelector("#notify-count");
let notifications = 0;

// 같은 저장소에 두 입력을 연결합니다. 변경 알림을 받으면 각 입력이 갱신됩니다.
bindSwitch(plainInput, store);
bindSwitch(styledInput, store);

function showState() {
  const state = store.getState();
  summary.textContent = state.checked ? "켜짐" : "꺼짐";
  stateView.textContent = JSON.stringify(state, null, 2);
  notifyCount.textContent = String(notifications);
}

// 구독은 자동 기능이 아니라, 저장소가 나중에 호출할 함수를 등록하는 일입니다.
store.subscribe(() => {
  notifications += 1;
  showState();
});
document.querySelector("#turn-on").addEventListener("click", () => store.setChecked(true));
showState();

// 이 페이지에서는 입력이 페이지와 수명을 같이합니다.
// 선택 실습 02에서 bindSwitch가 반환하는 cleanup을 사용합니다.
