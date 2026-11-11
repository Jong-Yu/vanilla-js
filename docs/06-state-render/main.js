const input = document.querySelector("#notifications");
const summary = document.querySelector("#summary");
const stateView = document.querySelector("#state-view");
const renderCount = document.querySelector("#render-count");
// 이 객체는 자바스크립트 메모리에 있습니다. DOM과 자동으로 연결되지 않습니다.
let state = { checked: false };
let renders = 0;

// render는 우리가 정한 이름입니다. 호출할 때만 아래 DOM 변경 코드가 실행됩니다.
function render() {
  renders += 1;
  input.checked = state.checked;
  input.dataset.state = state.checked ? "checked" : "unchecked";
  summary.textContent = state.checked ? "켜짐" : "꺼짐";
  stateView.textContent = JSON.stringify(state, null, 2);
  renderCount.textContent = String(renders);
}

function setChecked(checked) {
  // 변수의 값을 바꾸는 일과 화면을 바꾸는 일을 순서대로 실행합니다.
  state = { checked };
  render(); // 실험: 이 줄을 주석 처리하면 어떤 일이 생길까요?
}

input.addEventListener("change", (event) => {
  setChecked(event.currentTarget.checked);
});
document.querySelector("#turn-on").addEventListener("click", () => setChecked(true));
document.querySelector("#turn-off").addEventListener("click", () => setChecked(false));

render(); // 처음 화면도 직접 한 번 그립니다.
