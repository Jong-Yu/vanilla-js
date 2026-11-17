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

// 6-4. 목록을 다시 그릴 때 요소를 새로 만들면 상태에 없는 포커스와 입력값이 사라집니다.
{
  const list = document.querySelector("#keyed-list");
  const reuse = document.querySelector("#keyed-reuse");
  const result = document.querySelector("#keyed-result");
  const elements = new Map(); // 항목 id → 그 항목을 표현하는 li
  let items = [];
  let nextId = 1;

  function createItem(item) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.className = "stack";
    label.append(`${item.label} 메모`);
    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    label.append(input);
    li.append(label);
    return li;
  }
  // 방식 1: 모든 li를 새로 만들어 교체합니다. Map도 새 요소로 다시 채웁니다.
  function renderRecreate() {
    elements.clear();
    list.replaceChildren(...items.map((item) => {
      const li = createItem(item);
      elements.set(item.id, li);
      return li;
    }));
  }
  // 방식 2: id로 기존 li를 다시 쓰고, 제자리에 있는 요소는 옮기지 않습니다.
  function renderReuse() {
    let cursor = list.firstElementChild;
    for (const item of items) {
      const li = elements.get(item.id) ?? createItem(item);
      elements.set(item.id, li);
      if (li === cursor) cursor = cursor.nextElementSibling;
      else list.insertBefore(li, cursor);
    }
    const ids = new Set(items.map((item) => item.id));
    for (const [id, li] of elements) {
      if (!ids.has(id)) {
        li.remove();
        elements.delete(id);
      }
    }
  }
  function describeFocus() {
    const active = document.activeElement;
    if (!active || active === document.body) return "body (목록 밖으로 빠짐)";
    return list.contains(active) ? "목록 안의 입력 (유지됨)" : active.tagName.toLowerCase();
  }
  list.addEventListener("keydown", (event) => {
    // 한글 조합을 확정하는 Enter는 새 항목을 만들지 않습니다 (4장 예제 4-8).
    if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) return;
    if (!(event.target instanceof HTMLInputElement)) return;
    event.preventDefault();
    items = [{ id: nextId, label: `항목 ${nextId}` }, ...items].slice(0, 6);
    nextId += 1;
    if (reuse.checked) renderReuse();
    else renderRecreate();
    result.textContent = `${reuse.checked ? "다시 쓰기" : "새로 만들기"} · 항목 ${items.length}개 · 다시 그린 직후 포커스: ${describeFocus()}`;
  });
  function reset() {
    items = [1, 2, 3].map((id) => ({ id, label: `항목 ${id}` }));
    nextId = 4;
    reuse.checked = false;
    renderRecreate();
    result.textContent = "아직 다시 그리지 않았습니다.";
  }
  document.querySelector("#reset-keyed").addEventListener("click", reset);
  reset();
}
