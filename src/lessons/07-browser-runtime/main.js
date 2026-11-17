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
  orderLog.textContent = "";
  runOrder.setAttribute("aria-disabled", "true");
  const lines = [];
  function log(message) {
    lines.push(message);
    orderLog.textContent = lines.join("\n");
  }

  log("1. 클릭 콜백 시작 · 동기 실행");
  setTimeout(() => {
    log("5. setTimeout 콜백 · 나중의 task");
    orderRunning = false;
    runOrder.removeAttribute("aria-disabled");
  }, 0);
  Promise.resolve().then(() => {
    log("4. Promise.then 콜백 · microtask");
  });
  function doNow() {
    log("2. 직접 호출한 함수 · 동기 실행");
  }
  doNow();
  log("3. 클릭 콜백 끝 · 동기 실행");
});

runDom.addEventListener("click", () => {
  // 연속으로 실행하면 이전 실행의 화면 갱신 로그는 무시합니다.
  const currentRun = ++domRun;
  const lines = [];
  function log(message) {
    lines.push(message);
    domLog.textContent = lines.join("\n");
  }

  domValue.textContent = "첫 번째 값";
  log(`첫 대입 직후 읽기: ${domValue.textContent}`);
  domValue.textContent = "두 번째 값";
  log(`두 번째 대입 직후 읽기: ${domValue.textContent}`);
  Promise.resolve().then(() => {
    if (currentRun !== domRun) return;
    domValue.textContent = "microtask에서 바꾼 값";
    log(`microtask에서 읽기: ${domValue.textContent}`);
  });
  requestAnimationFrame(() => {
    if (currentRun !== domRun) return;
    log("requestAnimationFrame: 다음 화면 갱신의 paint 전에 콜백 실행");
  });
});

// 7-3. await는 그 함수의 나머지만 멈추고, 나머지는 microtask로 이어집니다.
const runAsync = document.querySelector("#run-async");
const asyncLog = document.querySelector("#async-log");
let asyncRunning = false;
runAsync.addEventListener("click", () => {
  if (asyncRunning) return;
  asyncRunning = true;
  asyncLog.textContent = "";
  const steps = [];
  const log = (step) => {
    steps.push(step);
    asyncLog.textContent = steps.join("\n");
  };
  async function load() {
    log("A · async 함수 안, await 전");
    await Promise.resolve();
    log("C · await 다음 (microtask)");
  }
  setTimeout(() => {
    log("D · 타이머 (task)");
    asyncRunning = false;
  }, 0);
  load();
  log("B · load()를 호출한 다음 줄");
});
