// 상태 저장소와 실제 <input type="checkbox" role="switch">를 연결합니다.
export function bindSwitch(input, store) {
  function render() {
    const { checked } = store.getState();
    // 현재 선택 여부는 HTML 속성이 아니라 DOM 프로퍼티로 읽고 씁니다.
    input.checked = checked;
    // CSS는 이 속성을 보고 선택 상태의 모양을 바꿀 수 있습니다.
    input.dataset.state = checked ? "checked" : "unchecked";
  }

  function handleChange() {
    // 클릭과 Space 키 처리는 브라우저가 담당합니다. 바뀐 결과만 읽습니다.
    store.setChecked(input.checked);
  }

  input.addEventListener("change", handleChange);
  const unsubscribe = store.subscribe(render);
  render();

  let cleanedUp = false;
  return function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    // 연결을 끊을 때는 DOM 이벤트와 저장소 구독을 모두 해제합니다.
    input.removeEventListener("change", handleChange);
    unsubscribe();
  };
}
