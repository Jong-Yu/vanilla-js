// 4-1. 직접 전달하는 이벤트는 dispatchEvent 호출 안에서 처리됩니다.
{
  const button = document.querySelector("#dispatch-notice");
  const result = document.querySelector("#dispatch-result");
  let steps = [];
  function log(step) {
    steps.push(step);
  }
  button.addEventListener("notice", () => log("B"));
  button.addEventListener("click", () => {
    steps = [];
    log("A");
    button.dispatchEvent(new Event("notice"));
    log("C");
    result.textContent = steps.join(" → ");
  });
}

// 4-2. 같은 이벤트의 target과 currentTarget을 단계마다 읽습니다.
{
  const button = document.querySelector("#nested-button");
  const parent = document.querySelector("#event-zone");
  const stopBubbling = document.querySelector("#stop-bubbling");
  const result = document.querySelector("#event-log");
  function log(event) {
    const phase = event.currentTarget === button
      ? "버튼"
      : event.eventPhase === Event.CAPTURING_PHASE ? "부모 캡처" : "부모 버블";
    result.textContent += `${phase} | target: #${event.target.id} | currentTarget: #${event.currentTarget.id}\n`;
  }
  // 캡처가 먼저 도착하므로 지난 클릭의 기록은 여기에서 비웁니다.
  parent.addEventListener("click", () => { result.textContent = ""; }, { capture: true });
  parent.addEventListener("click", log, { capture: true });
  button.addEventListener("click", (event) => {
    log(event);
    if (stopBubbling.checked) {
      event.stopPropagation();
      result.textContent += "→ 버튼에서 이후 전파를 멈췄습니다.\n";
    }
  });
  parent.addEventListener("click", log);
  document.querySelector("#clear-log").addEventListener("click", () => {
    stopBubbling.checked = false;
    result.textContent = "아직 클릭하지 않았습니다.";
  });
}

// 4-3. 기본 제출을 취소해도 submit은 부모로 전달됩니다.
{
  const form = document.querySelector("#message-form");
  const input = document.querySelector("#message");
  const result = document.querySelector("#submit-result");
  const parentResult = document.querySelector("#submit-parent");
  let submits = 0;
  let parentSubmits = 0;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submits += 1;
    result.textContent = `submit ${submits}회 · "${input.value}"를 읽었습니다. 페이지는 이동하지 않습니다.`;
  });
  document.querySelector("#sample-submit").addEventListener("submit", (event) => {
    parentSubmits += 1;
    parentResult.textContent = `부모에서 받은 submit: ${parentSubmits}회 · defaultPrevented: ${event.defaultPrevented}`;
  });
  document.querySelector("#reset-submit").addEventListener("click", () => {
    form.reset();
    submits = 0;
    parentSubmits = 0;
    result.textContent = "아직 제출하지 않았습니다.";
    parentResult.textContent = "부모에서 받은 submit: 0회";
  });
}

// 4-4. 사용자 편집과 프로그램 대입은 서로 다른 경로입니다.
{
  const input = document.querySelector("#typing-input");
  const result = document.querySelector("#input-event-log");
  const notice = document.querySelector("#assignment-notice");
  let inputs = 0;
  let changes = 0;
  function record(event) {
    if (event.type === "input") inputs += 1;
    if (event.type === "change") changes += 1;
    result.textContent = `input: ${inputs}회 · change: ${changes}회\n마지막 이벤트: ${event.type}\n그때의 value: ${input.value}`;
  }
  input.addEventListener("input", record);
  input.addEventListener("change", record);
  document.querySelector("#assign-value").addEventListener("click", () => {
    const before = `input ${inputs}회 / change ${changes}회`;
    input.value = "코드에서 넣은 값";
    notice.textContent = `대입 직전: ${before} → 대입 직후: input ${inputs}회 / change ${changes}회. 이벤트 횟수는 그대로입니다.`;
  });
  document.querySelector("#reset-input-events").addEventListener("click", () => {
    input.value = "";
    inputs = 0;
    changes = 0;
    result.textContent = "input: 0회 · change: 0회";
    notice.textContent = "아직 코드로 대입하지 않았습니다.";
  });
}

// 4-5. key는 키가 뜻하는 값이고 code는 물리 키의 위치입니다.
{
  const field = document.querySelector("#key-field");
  const result = document.querySelector("#key-log");
  let lines = [];
  field.addEventListener("keydown", (event) => {
    // JSON.stringify로 감싸면 Space의 key인 공백 문자도 " "로 보입니다.
    lines = [...lines, `key: ${JSON.stringify(event.key)} · code: ${event.code} · repeat: ${event.repeat}`].slice(-8);
    result.textContent = lines.join("\n");
  });
  document.querySelector("#reset-key-log").addEventListener("click", () => {
    lines = [];
    field.value = "";
    result.textContent = "아직 누른 키가 없습니다.";
  });
}

// 4-6. 직접 처리하기로 한 키만 기본 동작을 취소합니다.
{
  const area = document.querySelector("#scroll-area");
  const items = [...area.querySelectorAll("li")];
  const handleArrows = document.querySelector("#handle-arrows");
  const result = document.querySelector("#key-default-log");
  const position = document.querySelector("#scroll-position");
  const handledKeys = ["ArrowDown", "ArrowUp", "Home", "End"];
  let index = 0;
  function highlight(next, { scroll = true } = {}) {
    items[index].removeAttribute("data-highlighted");
    index = next;
    items[index].setAttribute("data-highlighted", "");
    // 기본 스크롤을 취소했으므로 강조한 항목이 보이도록 코드가 직접 스크롤합니다.
    if (scroll) items[index].scrollIntoView({ block: "nearest" });
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
    result.textContent = `마지막 키: ${JSON.stringify(event.key)} · 직접 처리: ${handled ? "예" : "아니요"} · defaultPrevented: ${event.defaultPrevented}`;
  });
  area.addEventListener("scroll", () => {
    position.textContent = `영역의 스크롤 위치: ${Math.round(area.scrollTop)}px`;
  });
  document.querySelector("#after-scroll-area").addEventListener("focus", () => {
    result.textContent += "\nTab 이동: 포커스가 영역 다음 버튼에 도착했습니다.";
  });
  document.querySelector("#reset-key-default").addEventListener("click", () => {
    handleArrows.checked = false;
    highlight(0, { scroll: false });
    area.scrollTop = 0;
    position.textContent = "영역의 스크롤 위치: 0px";
    result.textContent = "아직 누른 키가 없습니다.";
  });
}

// 4-7. 누름과 뗌은 각각의 이벤트이고, click은 둘이 같은 요소에서 끝난 결과입니다.
{
  const zone = document.querySelector("#pointer-zone");
  const result = document.querySelector("#pointer-log");
  let lines = [];
  function write(line) {
    lines.push(line);
    result.textContent = lines.join("\n");
  }
  function record(event) {
    const detail = event.type === "click" ? ` · detail: ${event.detail}` : "";
    write(`${event.currentTarget.textContent} | ${event.type}${detail}`);
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
    if (event.target === zone) write("감싼 영역 | click · target: 영역 자신");
  });
  document.querySelector("#reset-pointer-log").addEventListener("click", () => {
    lines = [];
    result.textContent = "아직 누르지 않았습니다.";
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
    result.textContent = lines.join("\n");
  }
  function showCount() {
    count.textContent = `조합을 확인하지 않는 처리: ${plainCount}회 · 조합을 확인하는 처리: ${guardedCount}회`;
  }
  for (const type of ["compositionstart", "compositionend"]) {
    field.addEventListener(type, (event) => write(`${type} · data: ${JSON.stringify(event.data)}`));
  }
  field.addEventListener("keydown", (event) => {
    write(`keydown · key: ${JSON.stringify(event.key)} · isComposing: ${event.isComposing} · keyCode: ${event.keyCode}`);
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
    result.textContent = "아직 입력하지 않았습니다.";
  });
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
    lines.push(`안쪽 리스너 · detail.value: ${event.detail.value} · isTrusted: ${event.isTrusted}`);
  });
  parent.addEventListener("choose", (event) => {
    lines.push(`부모 리스너 · detail.value: ${event.detail.value}`);
    if (cancel.checked) {
      event.preventDefault();
      lines.push("부모 리스너 · preventDefault 호출");
    }
  });
  document.querySelector("#dispatch-choose").addEventListener("click", () => {
    lines = [];
    const event = new CustomEvent("choose", { bubbles: bubbles.checked, cancelable: true, detail: { value: "A" } });
    const proceed = inner.dispatchEvent(event);
    lines.push(`dispatchEvent 반환값: ${proceed} → ${proceed ? "기본 처리를 진행합니다" : "기본 처리를 건너뜁니다"}`);
    result.textContent = lines.join("\n");
  });
  document.querySelector("#reset-custom-event").addEventListener("click", () => {
    bubbles.checked = false;
    cancel.checked = false;
    lines = [];
    result.textContent = "아직 전달하지 않았습니다.";
  });
}
