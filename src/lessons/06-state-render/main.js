// 6-1. 일반 객체와 DOM 요소는 서로 다른 객체입니다.
{
  const state = { checked: false };
  const view = document.querySelector("#manual-view");
  const result = document.querySelector("#memory-result");
  // 학습용 관찰 문구만 갱신합니다. 실제 알림 표시 view는 바꾸지 않습니다.
  function inspect() {
    result.textContent = `메모리 checked: ${state.checked} · 마지막으로 쓴 화면: ${view.textContent}`;
  }
  document.querySelector("#change-memory").addEventListener("click", () => {
    state.checked = true;
    inspect();
  });
  document.querySelector("#render-memory").addEventListener("click", () => {
    view.textContent = state.checked ? "켜짐" : "꺼짐";
    inspect();
  });
  document.querySelector("#reset-memory").addEventListener("click", () => {
    state.checked = false;
    view.textContent = "꺼짐";
    inspect();
  });
}

// 6-2. 파생값은 하나의 원본에서 필요할 때 계산합니다.
{
  const result = document.querySelector("#derived-result");
  function derive(checked) {
    const summary = checked ? "켜짐" : "꺼짐";
    const dataState = checked ? "checked" : "unchecked";
    const json = JSON.stringify({ checked });
    result.textContent = `원본 checked: ${checked}\n안내 문구: ${summary}\nCSS용 상태: ${dataState}\nJSON 표현: ${json}`;
  }
  document.querySelector("#derive-true").addEventListener("click", () => derive(true));
  document.querySelector("#derive-false").addEventListener("click", () => derive(false));
}

// 6-3. 모든 변경이 같은 함수에서 상태 저장과 DOM 반영을 수행합니다.
{
  const input = document.querySelector("#notifications");
  const summary = document.querySelector("#summary");
  const stateView = document.querySelector("#state-view");
  const renderCount = document.querySelector("#render-count");
  let state = { checked: false };
  let renders = 0;

  // render는 우리가 정한 이름입니다. 호출할 때만 아래 코드가 실행됩니다.
  function render() {
    renders += 1;
    input.checked = state.checked;
    input.dataset.state = state.checked ? "checked" : "unchecked";
    summary.textContent = state.checked ? "켜짐" : "꺼짐";
    stateView.textContent = JSON.stringify(state, null, 2);
    renderCount.textContent = String(renders);
  }
  function setChecked(checked) {
    state = { checked };
    render(); // 실험: 이 줄을 주석 처리하면 어떤 일이 생길까요?
  }
  input.addEventListener("change", (event) => {
    setChecked(event.currentTarget.checked);
  });
  document.querySelector("#turn-on").addEventListener("click", () => setChecked(true));
  document.querySelector("#turn-off").addEventListener("click", () => setChecked(false));
  document.querySelector("#reset-render").addEventListener("click", () => {
    renders = 0;
    setChecked(false);
  });
  render(); // 처음 화면도 직접 한 번 반영합니다.
}
