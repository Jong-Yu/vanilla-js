// 8-1 · 포커스는 문서의 상태입니다. 매 이동을 live region으로 알리지 않습니다.
const focusResult = document.querySelector("#focus-result");
function describeFocus() {
  const active = document.activeElement;
  showFields(focusResult, [
    ["document.activeElement", active ? { code: `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ""}` } : "없음"],
  ]);
}
document.addEventListener("focusin", describeFocus);
document.querySelector("#focus-name").addEventListener("click", () => {
  document.querySelector("#focus-name-input").focus();
});
document.querySelector("#focus-heading").addEventListener("click", () => {
  document.querySelector("#focus-title").focus();
});
describeFocus();

// 8-2 · FormData는 저장소가 아니라 폼의 현재 값을 읽습니다.
const profileForm = document.querySelector("#profile-form");
profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = [...new FormData(profileForm).entries()];
  showOutput(
    document.querySelector("#form-result"),
    outputMessage(`FormData에 담긴 항목 ${entries.length}개`),
    outputFields(entries.map(([name, value]) => [name, { code: JSON.stringify(value) }])),
  );
});

// 8-3 · 이 폼은 앞 예제와 입력 및 초기화 상태를 공유하지 않습니다.
const resetForm = document.querySelector("#reset-form");
const resetName = document.querySelector("#reset-name");
const resetNews = document.querySelector("#reset-news");
const resetResult = document.querySelector("#reset-result");
let resetTimer;
// 지금 입력의 값을 기록 한 줄로 만듭니다.
function resetRow(tag, tone) {
  return { tag, text: ["value ", { code: JSON.stringify(resetName.value) }, " · checked ", resetNews.checked], tone };
}
resetForm.addEventListener("reset", (event) => {
  const before = resetRow("reset 이벤트 안");
  showLog(resetResult, [before]);
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    if (event.defaultPrevented) return;
    showLog(resetResult, [before, resetRow("기본 reset 후", "accent")]);
  }, 0);
});

// 8-4 · focus는 버블링하지 않고 focusin·focusout은 버블링합니다.
const focusZone = document.querySelector("#focus-zone");
const focusZoneLog = document.querySelector("#focus-zone-log");
let focusZoneLines = [];
function describeElement(element) {
  if (!element) return null;
  return { code: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}` };
}
function writeFocusZone(line) {
  focusZoneLines = [...focusZoneLines, line].slice(-8);
  showLog(focusZoneLog, focusZoneLines);
}
// 영역 자신이 포커스를 받을 때만 실행됩니다. fieldset은 포커스를 받지 않으므로 기록되지 않습니다.
focusZone.addEventListener("focus", () => writeFocusZone({ tag: "focus", text: "영역 자신이 포커스를 받았습니다" }));
focusZone.addEventListener("focusin", (event) => {
  writeFocusZone({ tag: "focusin", text: ["target ", describeElement(event.target), " · relatedTarget ", describeElement(event.relatedTarget)] });
});
focusZone.addEventListener("focusout", (event) => {
  const next = event.relatedTarget;
  const meaning = next === null
    ? "포커스를 받을 대상이 없음"
    : focusZone.contains(next) ? "영역 안에서 이동" : "영역 밖으로 나감";
  writeFocusZone({
    tag: "focusout",
    text: ["target ", describeElement(event.target), " · relatedTarget ", describeElement(next)],
    note: meaning,
    tone: meaning === "영역 밖으로 나감" ? "accent" : undefined,
  });
});
document.querySelector("#reset-focus-zone").addEventListener("click", () => {
  focusZoneLines = [];
  showMessage(focusZoneLog, "아직 영역에 포커스가 들어오지 않았습니다.", "muted");
});

// 8-5 · 제약을 어긴 입력은 submit 대신 invalid 이벤트를 받습니다.
const signupForm = document.querySelector("#signup-form");
const signupEmail = document.querySelector("#signup-email");
const validationResult = document.querySelector("#validation-result");
let invalidCount = 0;
let submitCount = 0;
function describeValidity(prefix, tone) {
  const { valid, valueMissing, typeMismatch } = signupEmail.validity;
  showOutput(
    validationResult,
    outputMessage(prefix, tone),
    outputFields([
      ["validity.valid", valid],
      ["validity.valueMissing", valueMissing],
      ["validity.typeMismatch", typeMismatch],
      ["invalid 이벤트", `${invalidCount}회`],
      ["submit 이벤트", `${submitCount}회`],
    ]),
  );
}
// invalid는 버블링하지 않으므로 폼에서 캡처 단계로 듣습니다.
signupForm.addEventListener("invalid", () => {
  invalidCount += 1;
  describeValidity("검사 실패: invalid 이벤트가 발생했고 submit은 발생하지 않습니다.", "warn");
}, { capture: true });
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCount += 1;
  describeValidity("제출: 검사를 통과해 submit이 발생했습니다.", "good");
});
document.querySelector("#check-email").addEventListener("click", () => {
  const ok = signupEmail.checkValidity();
  describeValidity([{ code: "checkValidity()" }, " 결과 ", ok], ok ? "good" : "warn");
});
document.querySelector("#reset-validation").addEventListener("click", () => {
  signupEmail.value = "";
  invalidCount = 0;
  submitCount = 0;
  showMessage(validationResult, "아직 검사하지 않았습니다.", "muted");
});
