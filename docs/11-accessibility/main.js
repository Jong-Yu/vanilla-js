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
