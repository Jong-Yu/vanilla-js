// 8-1 · 포커스는 문서의 상태입니다. 매 이동을 live region으로 알리지 않습니다.
const focusResult = document.querySelector("#focus-result");
function describeFocus() {
  const active = document.activeElement;
  focusResult.textContent = active
    ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ""}`
    : "없음";
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
  document.querySelector("#form-result").textContent = JSON.stringify(
    [...new FormData(profileForm).entries()], null, 2,
  );
});

// 8-3 · 이 폼은 앞 예제와 입력 및 초기화 상태를 공유하지 않습니다.
const resetForm = document.querySelector("#reset-form");
const resetName = document.querySelector("#reset-name");
const resetNews = document.querySelector("#reset-news");
const resetResult = document.querySelector("#reset-result");
let resetTimer;
resetForm.addEventListener("reset", (event) => {
  const before = `reset 이벤트 안: value=${resetName.value}, checked=${resetNews.checked}`;
  resetResult.textContent = before;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    if (event.defaultPrevented) return;
    resetResult.textContent = `${before}\n기본 reset 후: value=${resetName.value}, checked=${resetNews.checked}`;
  }, 0);
});
