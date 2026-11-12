// 예제마다 블록을 나누어 서로의 변수에 영향을 주지 않게 합니다.
// 1-1. 숫자 대입과 문자열 계산은 그 순간의 값을 사용합니다.
{
  const result = document.querySelector("#assignment-result");
  document.querySelector("#run-assignment").addEventListener("click", () => {
    let count = 1;
    const saved = count;
    const message = `${count}개 완료`;
    count = 2;
    result.textContent = `count: ${count}\nsaved: ${saved}\nmessage: ${message}`;
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
    result.textContent = [
      `original.done: ${original.done} · alias.done: ${alias.done}`,
      `separate.done: ${separate.done}`,
      `original === alias: ${original === alias}`,
      `original === separate: ${original === separate}`,
    ].join("\n");
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
    result.textContent = `함수 전달 직후 calls: ${before}\n호출 후 calls: ${calls}\ntypeof callback: ${typeof callback}\nmessage: ${message}`;
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
    result.textContent = `A: ${lastA} · B: ${lastB}`;
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
}
