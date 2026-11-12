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
