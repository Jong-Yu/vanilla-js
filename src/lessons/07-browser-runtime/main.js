const runOrder = document.querySelector("#run-order");
const orderLog = document.querySelector("#order-log");
const runDom = document.querySelector("#run-dom");
const domValue = document.querySelector("#dom-value");
const domLog = document.querySelector("#dom-log");
let domRun = 0;
let orderRunning = false;

runOrder.addEventListener("click", () => {
  if (orderRunning) return;
  orderRunning = true;
  showOutput(orderLog);
  runOrder.setAttribute("aria-disabled", "true");
  const lines = [];
  // 기록 번호는 결과 화면이 실행된 순서대로 붙입니다.
  function log(tag, text, tone) {
    lines.push({ tag, text, tone });
    showLog(orderLog, lines);
  }

  log("동기", "클릭 콜백 시작");
  setTimeout(() => {
    log("task", "setTimeout 콜백 · 나중의 task");
    orderRunning = false;
    runOrder.removeAttribute("aria-disabled");
  }, 0);
  Promise.resolve().then(() => {
    log("microtask", "Promise.then 콜백", "accent");
  });
  function doNow() {
    log("동기", "직접 호출한 함수");
  }
  doNow();
  log("동기", "클릭 콜백 끝");
});

runDom.addEventListener("click", () => {
  // 연속으로 실행하면 이전 실행의 화면 갱신 로그는 무시합니다.
  const currentRun = ++domRun;
  const lines = [];
  function log(tag, text, tone) {
    lines.push({ tag, text, tone });
    showLog(domLog, lines);
  }

  domValue.textContent = "첫 번째 값";
  log("동기", ["첫 대입 직후 읽기 ", { code: JSON.stringify(domValue.textContent) }]);
  domValue.textContent = "두 번째 값";
  log("동기", ["두 번째 대입 직후 읽기 ", { code: JSON.stringify(domValue.textContent) }]);
  Promise.resolve().then(() => {
    if (currentRun !== domRun) return;
    domValue.textContent = "microtask에서 바꾼 값";
    log("microtask", ["바꾼 뒤 읽기 ", { code: JSON.stringify(domValue.textContent) }], "accent");
  });
  requestAnimationFrame(() => {
    if (currentRun !== domRun) return;
    log("rAF", "다음 화면 갱신의 paint 전에 콜백 실행");
  });
});

// 7-3. await는 그 함수의 나머지만 멈추고, 나머지는 microtask로 이어집니다.
const runAsync = document.querySelector("#run-async");
const asyncLog = document.querySelector("#async-log");
let asyncRunning = false;
runAsync.addEventListener("click", () => {
  if (asyncRunning) return;
  asyncRunning = true;
  showOutput(asyncLog);
  const steps = [];
  const log = (tag, text, tone) => {
    steps.push({ tag, text, tone });
    showLog(asyncLog, steps);
  };
  async function load() {
    log("A", "async 함수 안, await 전 · 동기");
    await Promise.resolve();
    log("C", "await 다음 · microtask", "accent");
  }
  setTimeout(() => {
    log("D", "타이머 콜백 · task");
    asyncRunning = false;
  }, 0);
  load();
  log("B", "load()를 호출한 다음 줄 · 동기");
});
