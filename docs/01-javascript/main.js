// 1. 값에 이름을 붙입니다. 객체 안에는 문자열과 배열이 들어 있습니다.
const learner = {
  name: "지우",
  topics: ["DOM", "이벤트"],
};
let completed = 0;

// 2. 함수를 정의합니다. 여기서는 아직 본문을 실행하지 않습니다.
function describe(name, count) {
  return `${name}: ${count}개 완료`;
}

// 3. 순서대로 실행합니다. 함수가 반환한 문자열을 message에 저장합니다.
completed += 1;
const message = describe(learner.name, completed);
console.log(message);

let topicText = "";
for (const topic of learner.topics) {
  topicText += `- ${topic}\n`;
}

// 4. 여기부터 DOM API입니다. 위에서 계산한 결과를 실제 문서에 표시합니다.
const result = document.querySelector("#result");
result.textContent = `${message}\n\n학습할 주제\n${topicText}`;
