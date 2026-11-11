const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const taskStatus = document.querySelector("#task-status");

function updateCount(message) {
  taskStatus.textContent = `${message} 현재 ${list.children.length}개입니다.`;
}
function addTask(text) {
  // 각각 독립된 요소 객체입니다. append하기 전에는 화면에 나타나지 않습니다.
  const item = document.createElement("li");
  const label = document.createElement("span");
  const removeButton = document.createElement("button");
  label.textContent = text; // 입력값을 HTML로 해석하지 않고 글자로 넣습니다.
  removeButton.type = "button";
  removeButton.textContent = "삭제";
  removeButton.dataset.action = "remove";
  removeButton.setAttribute("aria-label", `${text} 삭제`);
  item.append(label, removeButton);
  list.append(item);
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (text === "") {
    taskStatus.textContent = "공백이 아닌 주제를 입력하세요.";
    taskInput.focus();
    return;
  }
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
  updateCount("추가했습니다.");
});
// 목록에 리스너를 한 번 등록합니다. 이후에 추가된 삭제 버튼에도 동작합니다.
list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const removeButton = event.target.closest("button[data-action='remove']");
  if (!removeButton || !list.contains(removeButton)) return;
  removeButton.closest("li").remove();
  taskInput.focus();
  updateCount("삭제했습니다.");
});
const initialTopics = ["DOM 구조 읽기", "요소 직접 만들기"];
for (const topic of initialTopics) addTask(topic);
updateCount("초기 목록입니다.");
