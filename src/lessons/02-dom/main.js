// 예제 2-1 · 하나의 요소, 요소 목록, null을 구분합니다.
const queryResult = document.querySelector("#query-result");
const profile = document.querySelector("#profile");

function showElements(elements, description) {
  profile.classList.remove("is-found");
  for (const element of profile.querySelectorAll(".is-found")) {
    element.classList.remove("is-found");
  }
  const entries = [];
  for (const element of elements) {
    element.classList.add("is-found");
    entries.push({
      tag: element.tagName.toLowerCase(),
      text: ["부모 ", { code: element.parentElement.tagName.toLowerCase() }, ` · 자식 요소 ${element.children.length}개`],
    });
  }
  showOutput(queryResult, outputMessage(description), outputLog(entries));
}

document.querySelector("#find-one").addEventListener("click", () => {
  showElements([profile], ["요소 하나: ", { code: "section#profile" }]);
});
document.querySelector("#find-many").addEventListener("click", () => {
  const topics = profile.querySelectorAll(".topic");
  showElements(topics, ["NodeList · 길이 ", topics.length]);
});
document.querySelector("#find-missing").addEventListener("click", () => {
  const missing = profile.querySelector(".missing");
  showElements([], "");
  showOutput(queryResult, outputFields([['querySelector(".missing")', missing]]), outputMessage("일치하는 요소가 없어 null을 돌려받았습니다.", "muted"));
});

// 예제 2-2 · 요소 사이의 글자도 Text 노드입니다.
const sentence = document.querySelector("#node-sentence");
document.querySelector("#inspect-nodes").addEventListener("click", () => {
  // 노드마다 종류, 이름, 담긴 글자를 한 줄로 보여줍니다. 공백이 보이도록 글자는 따옴표로 감쌉니다.
  const nodes = [...sentence.childNodes].map((node) => ({
    tag: node.nodeType === Node.TEXT_NODE ? "Text" : "Element",
    text: [{ code: node.nodeName }, "  ", { code: JSON.stringify(node.textContent) }],
  }));
  showOutput(
    document.querySelector("#nodes-result"),
    outputFields([
      ["children.length", sentence.children.length],
      ["childNodes.length", sentence.childNodes.length],
    ]),
    outputLog(nodes),
  );
});

// 예제 2-3 · 두 참조와 한 문자열을 같은 시점에 저장합니다.
const first = document.querySelector("#reference-text");
const second = document.querySelector("#reference-text");
const savedText = first.textContent;
function describeReference() {
  showFields(document.querySelector("#reference-result"), [
    ["first === second", first === second],
    ["second.textContent", { code: JSON.stringify(second.textContent) }],
    ["savedText", { code: JSON.stringify(savedText) }],
  ]);
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
  showFields(document.querySelector("#collections-result"), [
    ["저장한 NodeList의 길이", saved.length],
    ["저장한 children의 길이", live.length],
    ["지금 다시 검색한 길이", collectionList.querySelectorAll("li").length],
    ["저장한 첫 요소의 글자", { code: JSON.stringify(saved[0].textContent) }],
  ]);
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
