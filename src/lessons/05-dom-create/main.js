// 예제 5-1 · 문서에 연결되지 않은 객체도 값을 가집니다.
const connectionList = document.querySelector("#connection-list");
const detachedItem = document.createElement("li");
detachedItem.textContent = "연결을 기다리는 항목";
function describeConnection() {
  document.querySelector("#connection-result").textContent = JSON.stringify({
    "item.isConnected": detachedItem.isConnected,
    "item.parentElement": detachedItem.parentElement?.tagName ?? null,
    "item.textContent": detachedItem.textContent,
    "목록의 요소 수": connectionList.children.length,
  }, null, 2);
}
document.querySelector("#connect-node").addEventListener("click", () => {
  connectionList.append(detachedItem);
  describeConnection();
});
document.querySelector("#detach-node").addEventListener("click", () => {
  detachedItem.remove();
  describeConnection();
});
describeConnection();

// 예제 5-2 · 이동은 같은 객체를, 복제는 새 객체를 사용합니다.
const left = document.querySelector("#identity-left");
const right = document.querySelector("#identity-right");
const original = left.querySelector("li");
let identityMessage = "처음에는 왼쪽에 원본 하나만 있습니다.";
function describeIdentity() {
  document.querySelector("#identity-result").textContent =
    `${identityMessage}\n왼쪽: ${left.children.length}개 / 오른쪽: ${right.children.length}개\n전체: ${left.children.length + right.children.length}개\n원본의 부모: ${original.parentElement.id}`;
}
document.querySelector("#move-node").addEventListener("click", () => {
  right.append(original);
  identityMessage = "같은 원본을 오른쪽 목록의 마지막으로 이동했습니다.";
  describeIdentity();
});
document.querySelector("#clone-node").addEventListener("click", () => {
  const copy = original.cloneNode(true);
  right.append(copy);
  identityMessage = `복사본을 추가했습니다. original === copy: ${original === copy}`;
  describeIdentity();
});
document.querySelector("#reset-identity").addEventListener("click", () => {
  left.replaceChildren(original);
  right.replaceChildren();
  identityMessage = "같은 원본 하나를 왼쪽으로 되돌리고 복사본을 제거했습니다.";
  describeIdentity();
});
describeIdentity();

// 예제 5-3 · 생성과 연결을 한 항목을 만드는 함수로 모읍니다.
const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const taskStatus = document.querySelector("#task-status");
const initialTopics = ["DOM 구조 읽기", "요소 직접 만들기"];

function updateCount(message) {
  taskStatus.textContent = `${message} 현재 ${list.children.length}개입니다.`;
}
function addTask(text) {
  const item = document.createElement("li");
  const label = document.createElement("span");
  const removeButton = document.createElement("button");
  label.textContent = text;
  removeButton.type = "button";
  removeButton.textContent = "삭제";
  removeButton.dataset.action = "remove";
  removeButton.setAttribute("aria-label", `${text} 삭제`);
  item.append(label, removeButton);
  list.append(item);
}
function resetTasks() {
  list.replaceChildren();
  for (const topic of initialTopics) addTask(topic);
  updateCount("처음 두 항목입니다.");
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
  updateCount(`${text} 주제를 추가했습니다.`);
});
// 부모에 한 번 등록한 리스너가 나중에 추가한 자식의 클릭도 받습니다.
list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const removeButton = event.target.closest("button[data-action='remove']");
  if (!removeButton || !list.contains(removeButton)) return;
  const item = removeButton.closest("li");
  const text = item.querySelector("span").textContent;
  // 포커스된 요소가 사라지기 전에 다음으로 이어갈 대상을 정합니다.
  const neighbor = item.nextElementSibling ?? item.previousElementSibling;
  const nextFocus = neighbor?.querySelector("button") ?? taskInput;
  item.remove();
  nextFocus.focus();
  updateCount(`${text} 주제를 삭제했습니다.`);
});
document.querySelector("#reset-tasks").addEventListener("click", resetTasks);
resetTasks();
