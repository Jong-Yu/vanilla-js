// 결과 표에서 문자열은 따옴표로 감싸 보여줍니다. null은 그대로 null로 보입니다.
const literal = (value) => ({ code: JSON.stringify(value) });

// 예제 3-1 · 입력의 value를 읽고 문단의 textContent에 씁니다.
const literalInput = document.querySelector("#literal-input");
const literalPreview = document.querySelector("#literal-preview");
document.querySelector("#apply-text").addEventListener("click", () => {
  literalPreview.textContent = literalInput.value;
  showFields(document.querySelector("#text-result"), [
    ["넣은 글자", literal(literalInput.value)],
    ["문단 안의 strong 요소", `${literalPreview.querySelectorAll("strong").length}개`],
  ]);
});

// 예제 3-2 · 기록은 읽는 함수를 실행한 순간의 값입니다.
const username = document.querySelector("#username");
const notifications = document.querySelector("#notifications");
function readValues() {
  showFields(document.querySelector("#snapshot"), [
    [[{ code: "value" }, " 현재 이름"], literal(username.value)],
    [[{ code: "defaultValue" }, " 기본 이름"], literal(username.defaultValue)],
    ["getAttribute('value')", literal(username.getAttribute("value"))],
    [[{ code: "checked" }, " 현재 선택"], notifications.checked],
    [[{ code: "defaultChecked" }, " 기본 선택"], notifications.defaultChecked],
    ["hasAttribute('checked')", notifications.hasAttribute("checked")],
  ]);
}
document.querySelector("#read-values").addEventListener("click", readValues);
document.querySelector("#defaults-form").addEventListener("submit", (event) => {
  event.preventDefault();
  readValues();
});
document.querySelector("#change-values").addEventListener("click", () => {
  username.value = "지우";
  notifications.checked = false;
  // property 대입은 사용자 input/change 이벤트를 자동 발생시키지 않습니다.
  readValues();
});
document.querySelector("#reset-values").addEventListener("click", () => {
  document.querySelector("#defaults-form").reset();
  readValues(); // reset() 호출이 끝난 뒤 현재값을 읽습니다.
});
readValues();

// 예제 3-3 · HTML 불리언 속성은 값보다 존재 여부가 중요합니다.
const booleanInput = document.querySelector("#boolean-input");
function describeDisabled() {
  showFields(document.querySelector("#boolean-result"), [
    ["getAttribute('disabled')", literal(booleanInput.getAttribute("disabled"))],
    ["hasAttribute('disabled')", booleanInput.hasAttribute("disabled")],
    [[{ code: "disabled" }, " property"], booleanInput.disabled],
  ]);
}
document.querySelector("#set-disabled-attribute").addEventListener("click", () => {
  booleanInput.setAttribute("disabled", "false");
  describeDisabled();
});
document.querySelector("#clear-disabled").addEventListener("click", () => {
  booleanInput.disabled = false;
  describeDisabled();
});
describeDisabled();

// 예제 3-4 · data 변경과 표현 반영을 일부러 두 단계로 나눕니다.
const preview = document.querySelector("#preview");
function describeStyle() {
  showFields(document.querySelector("#style-result"), [
    ["dataset.notifications", literal(preview.dataset.notifications)],
    ["className", literal(preview.className)],
    ["표시 문구", literal(preview.textContent)],
  ]);
}
function updatePreview() {
  const enabled = preview.dataset.notifications === "on";
  preview.textContent = `알림이 ${enabled ? "켜져" : "꺼져"} 있어요.`;
  preview.classList.toggle("status", enabled);
  describeStyle();
}
document.querySelector("#set-data").addEventListener("click", () => {
  preview.dataset.notifications = "on";
  describeStyle();
});
document.querySelector("#apply-style").addEventListener("click", updatePreview);
document.querySelector("#reset-style").addEventListener("click", () => {
  preview.dataset.notifications = "off";
  updatePreview();
});
describeStyle();
