// 예제 9-1: 기본 버튼은 마우스와 키보드 활성화를 모두 click으로 전달합니다.
const nativeButton = document.querySelector("#native-run");
const nativeResult = document.querySelector("#native-result");
let executionCount = 0;

nativeButton.addEventListener("click", () => {
  executionCount += 1;
  nativeResult.textContent = `실행 횟수: ${executionCount}회`;
});

document.querySelector("#native-reset").addEventListener("click", () => {
  executionCount = 0;
  nativeResult.textContent = "실행 횟수: 0회";
});

// 예제 9-2: label과 aria-describedby의 연결에는 JavaScript가 필요하지 않습니다.

// 예제 9-3: 한 번의 활성화에서 표시 상태와 접근성 상태를 함께 변경합니다.
const helpButton = document.querySelector("#help-toggle");
const helpPanel = document.querySelector("#help-panel");
const disclosureResult = document.querySelector("#disclosure-result");

helpButton.addEventListener("click", () => {
  const expanded = helpButton.getAttribute("aria-expanded") === "true";
  helpButton.setAttribute("aria-expanded", String(!expanded));
  helpPanel.hidden = expanded;
  disclosureResult.textContent = `aria-expanded="${!expanded}" · hidden=${expanded}`;
  // 키보드로 누른 버튼의 포커스를 패널로 강제로 이동하지 않습니다.
});

// 예제 9-4: 미리 존재하는 status의 내용을 변경하고 포커스는 유지합니다.
const recordButton = document.querySelector("#record-practice");
const practiceStatus = document.querySelector("#practice-status");
let completed = 0;

recordButton.addEventListener("click", () => {
  completed += 1;
  practiceStatus.textContent = `연습 ${completed}회를 기록했습니다.`;
});

// 예제 9-5: aria-hidden은 접근성 정보만 숨기고, inert는 포커스·클릭·접근성 정보를 함께 막습니다.
const hideAreaA = document.querySelector("#hide-area-a");
const hideAreaB = document.querySelector("#hide-area-b");
const applyAriaHidden = document.querySelector("#apply-aria-hidden");
const applyInert = document.querySelector("#apply-inert");
const hideResult = document.querySelector("#hide-result");
const hideClicks = { A: 0, B: 0 };

function applyHiding() {
  // 새로고침한 브라우저가 체크 상태를 복원하는 경우에도 영역의 속성을 체크와 맞춥니다.
  if (applyAriaHidden.checked) hideAreaA.setAttribute("aria-hidden", "true");
  else hideAreaA.removeAttribute("aria-hidden");
  hideAreaB.inert = applyInert.checked;
  document.querySelector("#hide-area-a-state").textContent = applyAriaHidden.checked ? 'aria-hidden="true"' : "속성 없음";
  document.querySelector("#hide-area-b-state").textContent = applyInert.checked ? "inert" : "속성 없음";
}
applyAriaHidden.addEventListener("change", applyHiding);
applyInert.addEventListener("change", applyHiding);
applyHiding();

for (const [name, area] of [["A", hideAreaA], ["B", hideAreaB]]) {
  area.querySelector("button").addEventListener("click", () => {
    hideClicks[name] += 1;
    hideResult.textContent = `A의 버튼 ${hideClicks.A}회 · B의 버튼 ${hideClicks.B}회 클릭했습니다.`;
  });
}
