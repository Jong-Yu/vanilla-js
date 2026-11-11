const queryResult = document.querySelector("#query-result");

function showElements(elements) {
  // 이전에 표시한 강조를 정리합니다. classList는 다음 단계에서 다룹니다.
  for (const element of document.querySelectorAll(".is-found")) {
    element.classList.remove("is-found");
  }
  const descriptions = [];
  for (const element of elements) {
    element.classList.add("is-found");
    descriptions.push({
      tag: element.tagName,
      id: element.id || "(없음)",
      parent: element.parentElement.tagName,
      childElementCount: element.children.length,
    });
  }
  queryResult.textContent = JSON.stringify(descriptions, null, 2);
}

// 버튼의 이벤트 등록은 04단계에서 설명합니다.
document.querySelector("#find-one").addEventListener("click", () => {
  const profile = document.querySelector("#profile");
  showElements([profile]);
});
document.querySelector("#find-many").addEventListener("click", () => {
  const topics = document.querySelectorAll(".topic");
  showElements(topics);
});
document.querySelector("#find-missing").addEventListener("click", () => {
  const missing = document.querySelector("#does-not-exist");
  showElements([]);
  if (missing === null) {
    queryResult.textContent = "null — 일치하는 요소가 없습니다.";
  }
});
