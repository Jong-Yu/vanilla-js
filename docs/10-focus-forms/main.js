const form = document.querySelector("#profile-form");
const nickname = document.querySelector("#nickname");
const news = document.querySelector("#news");
const formResult = document.querySelector("#form-result");
const focusResult = document.querySelector("#focus-result");
const resetResult = document.querySelector("#reset-result");
const focusTitle = document.querySelector("#focus-title");
let resetTimer;

function describeFocus() {
  const active = document.activeElement;
  focusResult.textContent = active
    ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ""}`
    : "없음";
}

document.addEventListener("focusin", describeFocus);
document.querySelector("#focus-name").addEventListener("click", () => nickname.focus());
document.querySelector("#focus-heading").addEventListener("click", () => focusTitle.focus());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  // 같은 name이 여러 번 나와도 보존하기 위해 entries를 배열로 확인합니다.
  formResult.textContent = JSON.stringify([...new FormData(form).entries()], null, 2);
});

form.addEventListener("reset", (event) => {
  const before = `reset 이벤트 안: value=${nickname.value}, checked=${news.checked}`;
  resetResult.textContent = before;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    if (event.defaultPrevented) return;
    resetResult.textContent = `${before}\n기본 reset 후: value=${nickname.value}, checked=${news.checked}`;
    formResult.textContent = "초기화되었습니다. 폼 값을 다시 읽어보세요.";
  }, 0);
});

describeFocus();
