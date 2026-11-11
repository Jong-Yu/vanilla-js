// 예제 2-1 · 하나의 요소, 요소 목록, null을 구분합니다.
const queryResult = document.querySelector("#query-result");
const profile = document.querySelector("#profile");

function showElements(elements, description) {
  profile.classList.remove("is-found");
  for (const element of profile.querySelectorAll(".is-found")) {
    element.classList.remove("is-found");
  }
  const descriptions = [];
  for (const element of elements) {
    element.classList.add("is-found");
    descriptions.push({
      tag: element.tagName,
      parent: element.parentElement.tagName,
      childElementCount: element.children.length,
    });
  }
  queryResult.textContent = `${description}\n${JSON.stringify(descriptions, null, 2)}`;
}

document.querySelector("#find-one").addEventListener("click", () => {
  showElements([profile], "요소 하나: section#profile");
});
document.querySelector("#find-many").addEventListener("click", () => {
  const topics = profile.querySelectorAll(".topic");
  showElements(topics, `NodeList: 길이 ${topics.length}`);
});
document.querySelector("#find-missing").addEventListener("click", () => {
  const missing = profile.querySelector(".missing");
  showElements([], "");
  queryResult.textContent = `${missing} — 일치하는 요소가 없습니다.`;
});

// 예제 2-2 · 요소 사이의 글자도 Text 노드입니다.
const sentence = document.querySelector("#node-sentence");
document.querySelector("#inspect-nodes").addEventListener("click", () => {
  const nodes = [...sentence.childNodes].map((node) => ({
    type: node.nodeType === Node.TEXT_NODE ? "Text" : "Element",
    name: node.nodeName,
    text: node.textContent,
  }));
  document.querySelector("#nodes-result").textContent =
    `children: ${sentence.children.length}개 / childNodes: ${sentence.childNodes.length}개\n${JSON.stringify(nodes, null, 2)}`;
});

// 예제 2-3 · 두 참조와 한 문자열을 같은 시점에 저장합니다.
const first = document.querySelector("#reference-text");
const second = document.querySelector("#reference-text");
const savedText = first.textContent;
function describeReference() {
  document.querySelector("#reference-result").textContent =
    `first === second: ${first === second}\nsecond.textContent: ${second.textContent}\nsavedText: ${savedText}`;
}
document.querySelector("#change-reference").addEventListener("click", () => {
  first.textContent = "바뀐 문구";
  describeReference();
});
document.querySelector("#reset-reference").addEventListener("click", () => {
  first.textContent = savedText;
  describeReference();
});
describeReference();

// 예제 2-4 · 검색 당시 구성원과 현재 구성원을 따로 읽습니다.
const collectionList = document.querySelector("#collection-list");
let saved = collectionList.querySelectorAll("li");
const live = collectionList.children;
function describeCollections() {
  document.querySelector("#collections-result").textContent =
    `저장한 NodeList: ${saved.length}개\n저장한 children: ${live.length}개\n지금 다시 검색: ${collectionList.querySelectorAll("li").length}개\n저장한 첫 요소의 텍스트: ${saved[0].textContent}`;
}
document.querySelector("#append-collection").addEventListener("click", () => {
  const item = document.createElement("li");
  item.textContent = `추가 항목 ${live.length + 1}`;
  collectionList.append(item);
  describeCollections();
});
document.querySelector("#rename-collection").addEventListener("click", () => {
  saved[0].textContent = "저장한 참조로 바꾼 첫 항목";
  describeCollections();
});
document.querySelector("#reset-collection").addEventListener("click", () => {
  collectionList.replaceChildren();
  for (const text of ["첫 항목", "둘째 항목"]) {
    const item = document.createElement("li");
    item.textContent = text;
    collectionList.append(item);
  }
  saved = collectionList.querySelectorAll("li");
  describeCollections();
});
describeCollections();
