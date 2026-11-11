const runOrder = document.querySelector("#run-order");
const orderLog = document.querySelector("#order-log");
const runDom = document.querySelector("#run-dom");
const domValue = document.querySelector("#dom-value");
const domLog = document.querySelector("#dom-log");
let domRun = 0;

runOrder.addEventListener("click", () => {
  orderLog.textContent = "";
  runOrder.disabled = true;
  const lines = [];
  function log(message) {
    lines.push(message);
    orderLog.textContent = lines.join("\n");
  }

  log("1. 클릭 콜백 시작 · 동기 실행");
  setTimeout(() => {
    log("5. setTimeout 콜백 · 나중의 task");
    runOrder.disabled = false;
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
