// 예제의 실행 결과를 화면에 그리는 공통 도우미입니다.
// 각 장이 설명하는 개념과는 관계없고, 결과를 읽기 쉬운 기록 목록과 이름·값 표로 바꾸는 일만 합니다.
// 값은 모두 textContent나 텍스트 노드로 넣으므로 입력한 글자가 HTML로 해석되지 않습니다.
// 일반 스크립트로 불러오므로 아래 함수는 같은 페이지의 main.js에서 바로 사용할 수 있습니다.

// 값 하나를 결과 안의 조각으로 바꿉니다.
// 문자열은 그대로 글자로, 숫자·불리언·null·undefined는 코드 조각으로, { code: "..." }는 코드 조각으로 표시합니다.
function outputPart(value) {
  if (value instanceof Node) return value;
  const code = document.createElement("code");
  if (value !== null && typeof value === "object" && "code" in value) {
    code.textContent = value.code;
    return code;
  }
  if (typeof value === "string") return document.createTextNode(value);
  code.textContent = String(value);
  if (typeof value === "boolean") code.className = value ? "is-true" : "is-false";
  return code;
}

// 문자열 하나나 조각들의 배열을 요소 안에 차례로 붙입니다.
function appendOutputParts(element, parts) {
  for (const part of Array.isArray(parts) ? parts : [parts]) element.append(outputPart(part));
  return element;
}

// 한 문장짜리 결과를 만듭니다. tone은 "good", "warn", "muted" 중 하나를 쓸 수 있습니다.
function outputMessage(parts, tone) {
  const message = document.createElement("p");
  message.className = "output-message";
  if (tone) message.dataset.tone = tone;
  return appendOutputParts(message, parts);
}

// [이름, 값] 쌍의 배열을 표로 만듭니다. 한글이 없는 이름은 코드로 보고 코드 글꼴로 표시합니다.
// 이름에 코드와 설명을 함께 쓰려면 [{ code: "value" }, " 현재 이름"]처럼 조각 배열을 넘깁니다.
function outputFields(rows) {
  const list = document.createElement("dl");
  list.className = "output-fields";
  for (const [name, value] of rows) {
    const term = document.createElement("dt");
    if (Array.isArray(name)) appendOutputParts(term, name);
    else term.append(/[가-힣]/.test(name) ? name : outputPart({ code: name }));
    const detail = document.createElement("dd");
    appendOutputParts(detail, value);
    list.append(term, detail);
  }
  return list;
}

// 순서가 있는 기록을 만듭니다.
// 항목은 문자열(또는 조각 배열)이거나 { tag, text, note, tone } 객체입니다.
function outputLog(entries) {
  const list = document.createElement("ol");
  list.className = "output-log";
  for (const entry of entries) {
    const { tag, text, note, tone } = entry !== null && typeof entry === "object" && !Array.isArray(entry) && "text" in entry
      ? entry
      : { text: entry };
    const item = document.createElement("li");
    if (tone) item.dataset.tone = tone;
    if (tag) {
      const chip = document.createElement("span");
      chip.className = "output-tag";
      chip.textContent = tag;
      item.append(chip);
    }
    item.append(appendOutputParts(Object.assign(document.createElement("span"), { className: "output-text" }), text));
    if (note) {
      const small = document.createElement("span");
      small.className = "output-note";
      small.textContent = note;
      item.append(small);
    }
    list.append(item);
  }
  return list;
}

// 결과 영역의 내용을 새 조각들로 바꿉니다.
function showOutput(target, ...blocks) {
  target.replaceChildren(...blocks);
}

function showMessage(target, parts, tone) {
  showOutput(target, outputMessage(parts, tone));
}

function showFields(target, rows) {
  showOutput(target, outputFields(rows));
}

function showLog(target, entries, emptyText = "아직 기록이 없습니다.") {
  showOutput(target, entries.length ? outputLog(entries) : outputMessage(emptyText, "muted"));
}
