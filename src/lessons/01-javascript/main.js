// 예제마다 블록을 나누어 서로의 변수에 영향을 주지 않게 합니다.
// 1-1. 숫자 대입과 문자열 계산은 그 순간의 값을 사용합니다.
{
  const result = document.querySelector("#assignment-result");
  document.querySelector("#run-assignment").addEventListener("click", () => {
    let count = 1;
    const saved = count;
    const message = `${count}개 완료`;
    count = 2;
    showFields(result, [
      ["count", count],
      ["saved", saved],
      ["message", { code: JSON.stringify(message) }],
    ]);
  });
}

// 1-2. 객체를 대입하면 복제하는 대신 같은 객체를 가리킵니다.
{
  const result = document.querySelector("#reference-result");
  document.querySelector("#run-reference").addEventListener("click", () => {
    const original = { done: false };
    const alias = original;
    const separate = { done: false };
    alias.done = true;
    showFields(result, [
      ["original.done", original.done],
      ["alias.done", alias.done],
      ["separate.done", separate.done],
      ["original === alias", original === alias],
      ["original === separate", original === separate],
    ]);
  });
}

// 1-3. 함수 전달과 호출의 사이에서 실행 횟수를 읽습니다.
{
  const result = document.querySelector("#function-result");
  document.querySelector("#run-function").addEventListener("click", () => {
    let calls = 0;
    function describe(count) {
      calls += 1;
      return `${count}개 완료`;
    }
    const callback = describe;
    const before = calls;
    const message = callback(2);
    showFields(result, [
      ["함수를 전달한 직후 calls", before],
      ["호출한 뒤 calls", calls],
      ["typeof callback", { code: JSON.stringify(typeof callback) }],
      ["message", { code: JSON.stringify(message) }],
    ]);
  });
}

// 1-4. 별도로 만든 두 함수는 서로 다른 count에 접근합니다.
{
  const result = document.querySelector("#closure-result");
  function createCounter() {
    let count = 0;
    return () => ++count;
  }
  let nextA = createCounter();
  let nextB = createCounter();
  // 화면에는 각 함수가 마지막으로 반환한 값을 기록합니다.
  let lastA = 0;
  let lastB = 0;
  function show() {
    showFields(result, [
      ["A가 마지막으로 돌려준 값", lastA],
      ["B가 마지막으로 돌려준 값", lastB],
    ]);
  }
  document.querySelector("#next-a").addEventListener("click", () => {
    lastA = nextA();
    show();
  });
  document.querySelector("#next-b").addEventListener("click", () => {
    lastB = nextB();
    show();
  });
  document.querySelector("#reset-counters").addEventListener("click", () => {
    nextA = createCounter();
    nextB = createCounter();
    lastA = 0;
    lastB = 0;
    show();
  });
  show();
}

// 1-5. 조건에서 거짓으로 취급되는 값과 ??가 기본값을 고르는 기준은 다릅니다.
{
  const result = document.querySelector("#falsy-result");
  const candidates = { zero: 0, empty: "", text: "false", list: [], none: null, missing: undefined };
  // JSON.stringify(undefined)는 문자열이 아니라 undefined를 돌려주므로 ??로 표시할 글자를 정합니다.
  const literal = (value) => ({ code: JSON.stringify(value) ?? "undefined" });
  for (const button of document.querySelectorAll("[data-falsy]")) {
    button.addEventListener("click", () => {
      const value = candidates[button.dataset.falsy];
      showFields(result, [
        ["value", literal(value)],
        ["Boolean(value)", Boolean(value)],
        ['value || "기본값"', literal(value || "기본값")],
        ['value ?? "기본값"', literal(value ?? "기본값")],
      ]);
    });
  }
}

// 1-6. this는 함수를 정의한 곳이 아니라 호출한 방식으로 정해집니다.
{
  const result = document.querySelector("#this-result");
  let lastThis;
  const counter = {
    report() {
      lastThis = this;
      return this;
    },
  };
  function label(value) {
    if (value === counter) return "counter 객체";
    if (value === window) return "window (일반 스크립트의 전역 객체)";
    if (value instanceof Element) return `${value.tagName.toLowerCase()}#${value.id} (리스너가 등록된 요소)`;
    return String(value);
  }
  function show(call) {
    showFields(result, [
      ["호출한 방식", { code: call }],
      ["this", label(lastThis)],
    ]);
  }
  document.querySelector("#call-method").addEventListener("click", () => {
    counter.report();
    show("counter.report()");
  });
  document.querySelector("#call-detached").addEventListener("click", () => {
    const run = counter.report;
    run();
    show("const run = counter.report; run()");
  });
  document.querySelector("#call-wrapped").addEventListener("click", () => {
    const wrapped = () => counter.report();
    wrapped();
    show("const wrapped = () => counter.report(); wrapped()");
  });
  const listenerButton = document.querySelector("#call-listener");
  // 메서드를 그대로 리스너로 넘깁니다. 브라우저가 this를 버튼으로 정해 호출합니다.
  listenerButton.addEventListener("click", counter.report);
  listenerButton.addEventListener("click", () => show('addEventListener("click", counter.report)'));
}
