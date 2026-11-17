// 결과 표시는 ../../shared/output.js의 showLog, showFields 등을 사용합니다.

// 4-1. 직접 전달하는 이벤트는 dispatchEvent 호출 안에서 처리됩니다.
{
  const button = document.querySelector("#dispatch-notice");
  const result = document.querySelector("#dispatch-result");
  let steps = [];
  function log(step, text) {
    steps.push({ tag: step, text });
  }
  button.addEventListener("notice", () => log("B", "notice 핸들러 실행"));
  button.addEventListener("click", () => {
    steps = [];
    log("A", "dispatchEvent 앞의 줄");
    button.dispatchEvent(new Event("notice"));
    log("C", "dispatchEvent 다음 줄");
    showLog(result, steps);
  });
}

// 4-2. 같은 이벤트의 target과 currentTarget을 단계마다 읽습니다.
{
  const button = document.querySelector("#nested-button");
  const parent = document.querySelector("#event-zone");
  const stopBubbling = document.querySelector("#stop-bubbling");
  const result = document.querySelector("#event-log");
  let lines = [];
  function log(event) {
    const phase = event.currentTarget === button
      ? "버튼"
      : event.eventPhase === Event.CAPTURING_PHASE ? "부모 캡처" : "부모 버블";
    lines.push({
      tag: phase,
      text: ["target ", { code: `#${event.target.id}` }, " · currentTarget ", { code: `#${event.currentTarget.id}` }],
    });
    showLog(result, lines);
  }
  // 캡처가 먼저 도착하므로 지난 클릭의 기록은 여기에서 비웁니다.
  parent.addEventListener("click", () => { lines = []; }, { capture: true });
  parent.addEventListener("click", log, { capture: true });
  button.addEventListener("click", (event) => {
    log(event);
    if (stopBubbling.checked) {
      event.stopPropagation();
      lines.push({ tag: "멈춤", text: "버튼에서 이후 전파를 멈췄습니다.", tone: "warn" });
      showLog(result, lines);
    }
  });
  parent.addEventListener("click", log);
  document.querySelector("#clear-log").addEventListener("click", () => {
    stopBubbling.checked = false;
    lines = [];
    showMessage(result, "아직 클릭하지 않았습니다.", "muted");
  });
}

// 4-3. 기본 제출을 취소해도 submit은 부모로 전달됩니다.
{
  const form = document.querySelector("#message-form");
  const input = document.querySelector("#message");
  const result = document.querySelector("#submit-result");
  let submits = 0;
  let parentSubmits = 0;
  let parentSawPrevented = null;
  function render() {
    showOutput(
      result,
      outputFields([
        ["폼의 submit 리스너", `${submits}회`],
        ["읽은 문구", { code: JSON.stringify(input.value) }],
        ["부모가 받은 submit", `${parentSubmits}회`],
        ["부모에서 본 defaultPrevented", parentSawPrevented],
      ]),
      outputMessage("기본 제출을 취소했으므로 페이지는 이동하지 않습니다.", "muted"),
    );
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submits += 1;
    render();
  });
  document.querySelector("#sample-submit").addEventListener("submit", (event) => {
    parentSubmits += 1;
    parentSawPrevented = event.defaultPrevented;
    render();
  });
  document.querySelector("#reset-submit").addEventListener("click", () => {
    form.reset();
    submits = 0;
    parentSubmits = 0;
    parentSawPrevented = null;
    showMessage(result, "아직 제출하지 않았습니다.", "muted");
  });
}

// 4-4. 사용자 편집과 프로그램 대입은 서로 다른 경로입니다.
{
  const input = document.querySelector("#typing-input");
  const result = document.querySelector("#input-event-log");
  const notice = document.querySelector("#assignment-notice");
  let inputs = 0;
  let changes = 0;
  let lastType = null;
  function render() {
    showFields(result, [
      ["input 이벤트", `${inputs}회`],
      ["change 이벤트", `${changes}회`],
      ["마지막 이벤트", lastType ? { code: lastType } : "없음"],
      ["그때의 value", { code: JSON.stringify(input.value) }],
    ]);
  }
  function record(event) {
    if (event.type === "input") inputs += 1;
    if (event.type === "change") changes += 1;
    lastType = event.type;
    render();
  }
  input.addEventListener("input", record);
  input.addEventListener("change", record);
  document.querySelector("#assign-value").addEventListener("click", () => {
    const before = { inputs, changes };
    input.value = "코드에서 넣은 값";
    showOutput(
      notice,
      outputFields([
        ["대입 직전", `input ${before.inputs}회 · change ${before.changes}회`],
        ["대입 직후", `input ${inputs}회 · change ${changes}회`],
      ]),
      outputMessage("코드로 value를 바꿔도 이벤트 횟수는 그대로입니다.", "good"),
    );
  });
  document.querySelector("#reset-input-events").addEventListener("click", () => {
    input.value = "";
    inputs = 0;
    changes = 0;
    lastType = null;
    render();
    showMessage(notice, "아직 코드로 대입하지 않았습니다.", "muted");
  });
  render();
}

// 4-5. key는 키가 뜻하는 값이고 code는 물리 키의 위치입니다.
{
  const field = document.querySelector("#key-field");
  const result = document.querySelector("#key-log");
  let lines = [];
  field.addEventListener("keydown", (event) => {
    // JSON.stringify로 감싸면 Space의 key인 공백 문자도 " "로 보입니다.
    const line = {
      tag: "keydown",
      text: ["key ", { code: JSON.stringify(event.key) }, " · code ", { code: event.code }],
      note: event.repeat ? "repeat: true · 길게 눌러 반복된 이벤트" : undefined,
    };
    lines = [...lines, line].slice(-8);
    showLog(result, lines);
  });
  document.querySelector("#reset-key-log").addEventListener("click", () => {
    lines = [];
    field.value = "";
    showMessage(result, "아직 누른 키가 없습니다.", "muted");
  });
}

// 4-6. 직접 처리하기로 한 키만 기본 동작을 취소합니다.
{
  const area = document.querySelector("#scroll-area");
  const items = [...area.querySelectorAll("li")];
  const handleArrows = document.querySelector("#handle-arrows");
  const result = document.querySelector("#key-default-log");
  const handledKeys = ["ArrowDown", "ArrowUp", "Home", "End"];
  let index = 0;
  let last = null;
  let tabArrived = false;
  function highlight(next, { scroll = true } = {}) {
    items[index].removeAttribute("data-highlighted");
    index = next;
    items[index].setAttribute("data-highlighted", "");
    // 기본 스크롤을 취소했으므로 강조한 항목이 보이도록 코드가 직접 스크롤합니다.
    if (scroll) items[index].scrollIntoView({ block: "nearest" });
  }
  function render() {
    const rows = [["영역의 스크롤 위치", `${Math.round(area.scrollTop)}px`]];
    if (last) {
      rows.unshift(
        ["마지막 키", { code: JSON.stringify(last.key) }],
        ["직접 처리", last.handled ? "예" : "아니요"],
        ["defaultPrevented", last.prevented],
      );
    }
    const blocks = [outputFields(rows)];
    if (!last) blocks.unshift(outputMessage("아직 누른 키가 없습니다.", "muted"));
    if (tabArrived) blocks.push(outputMessage("Tab 이동: 포커스가 영역 다음 버튼에 도착했습니다.", "good"));
    showOutput(result, ...blocks);
  }
  area.addEventListener("keydown", (event) => {
    const handled = handleArrows.checked && handledKeys.includes(event.key);
    if (handled) {
      event.preventDefault();
      if (event.key === "ArrowDown") highlight(Math.min(index + 1, items.length - 1));
      if (event.key === "ArrowUp") highlight(Math.max(index - 1, 0));
      if (event.key === "Home") highlight(0);
      if (event.key === "End") highlight(items.length - 1);
    }
    last = { key: event.key, handled, prevented: event.defaultPrevented };
    tabArrived = false;
    render();
  });
  area.addEventListener("scroll", render);
  document.querySelector("#after-scroll-area").addEventListener("focus", () => {
    tabArrived = true;
    render();
  });
  document.querySelector("#reset-key-default").addEventListener("click", () => {
    handleArrows.checked = false;
    highlight(0, { scroll: false });
    area.scrollTop = 0;
    last = null;
    tabArrived = false;
    render();
  });
  render();
}

// 4-7. 누름과 뗌은 각각의 이벤트이고, click은 둘이 같은 요소에서 끝난 결과입니다.
{
  const zone = document.querySelector("#pointer-zone");
  const result = document.querySelector("#pointer-log");
  let lines = [];
  function write(line) {
    lines.push(line);
    showLog(result, lines);
  }
  function record(event) {
    const text = event.type === "click"
      ? [event.currentTarget.textContent, " · detail ", event.detail]
      : event.currentTarget.textContent;
    write({ tag: event.type, text, tone: event.type === "click" ? "accent" : undefined });
  }
  // 새 조작이 시작되면 기록을 새로 시작합니다. 캡처 단계라서 버튼의 기록보다 먼저 실행됩니다.
  for (const type of ["pointerdown", "keydown"]) {
    zone.addEventListener(type, () => { lines = []; }, { capture: true });
  }
  for (const button of zone.querySelectorAll("button")) {
    for (const type of ["pointerdown", "mousedown", "focus", "pointerup", "mouseup", "click"]) {
      button.addEventListener(type, record);
    }
  }
  // 버튼이 아니라 감싼 영역 자체가 click의 target일 때만 기록합니다.
  zone.addEventListener("click", (event) => {
    if (event.target === zone) write({ tag: "click", text: "감싼 영역 · target이 영역 자신", tone: "accent" });
  });
  document.querySelector("#reset-pointer-log").addEventListener("click", () => {
    lines = [];
    showMessage(result, "아직 누르지 않았습니다.", "muted");
  });
}

// 4-8. 한글 조합 중의 keydown은 isComposing이나 keyCode 229로 구별합니다.
{
  const field = document.querySelector("#composition-field");
  const count = document.querySelector("#composition-count");
  const result = document.querySelector("#composition-log");
  let lines = [];
  let plainCount = 0;
  let guardedCount = 0;
  function write(line) {
    lines = [...lines, line].slice(-10);
    showLog(result, lines);
  }
  function showCount() {
    showFields(count, [
      ["조합을 확인하지 않는 처리", `${plainCount}회`],
      ["조합을 확인하는 처리", `${guardedCount}회`],
    ]);
  }
  for (const type of ["compositionstart", "compositionend"]) {
    field.addEventListener(type, (event) => write({ tag: type, text: ["data ", { code: JSON.stringify(event.data) }] }));
  }
  field.addEventListener("keydown", (event) => {
    write({
      tag: "keydown",
      text: ["key ", { code: JSON.stringify(event.key) }, " · isComposing ", event.isComposing, " · keyCode ", event.keyCode],
      tone: event.key === "Enter" ? "accent" : undefined,
    });
    if (event.key !== "Enter") return;
    plainCount += 1;
    if (!(event.isComposing || event.keyCode === 229)) guardedCount += 1;
    showCount();
  });
  document.querySelector("#reset-composition").addEventListener("click", () => {
    lines = [];
    plainCount = 0;
    guardedCount = 0;
    field.value = "";
    showCount();
    showMessage(result, "아직 입력하지 않았습니다.", "muted");
  });
  showCount();
}

// 4-9. 직접 만든 이벤트는 만들 때 정한 옵션만큼만 전달되고 취소됩니다.
{
  const parent = document.querySelector("#custom-parent");
  const inner = document.querySelector("#custom-inner");
  const bubbles = document.querySelector("#custom-bubbles");
  const cancel = document.querySelector("#custom-cancel");
  const result = document.querySelector("#custom-log");
  let lines = [];
  inner.addEventListener("choose", (event) => {
    lines.push({ tag: "안쪽 리스너", text: ["detail.value ", { code: JSON.stringify(event.detail.value) }, " · isTrusted ", event.isTrusted] });
  });
  parent.addEventListener("choose", (event) => {
    lines.push({ tag: "부모 리스너", text: ["detail.value ", { code: JSON.stringify(event.detail.value) }] });
    if (cancel.checked) {
      event.preventDefault();
      lines.push({ tag: "부모 리스너", text: "preventDefault()를 호출했습니다.", tone: "warn" });
    }
  });
  document.querySelector("#dispatch-choose").addEventListener("click", () => {
    lines = [];
    const event = new CustomEvent("choose", { bubbles: bubbles.checked, cancelable: true, detail: { value: "A" } });
    const proceed = inner.dispatchEvent(event);
    lines.push({
      tag: "dispatchEvent",
      text: ["반환값 ", proceed, proceed ? " · 기본 처리를 진행합니다" : " · 기본 처리를 건너뜁니다"],
      tone: "accent",
    });
    showLog(result, lines);
  });
  document.querySelector("#reset-custom-event").addEventListener("click", () => {
    bubbles.checked = false;
    cancel.checked = false;
    lines = [];
    showMessage(result, "아직 전달하지 않았습니다.", "muted");
  });
}
