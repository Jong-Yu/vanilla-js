// A deliberately small Markdown renderer for the learning guide bundled offline.
// Raw HTML is text; this does not try to implement the full Markdown grammar.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function safeHref(value) {
  const href = value.trim();
  if (/[\u0000-\u0020\u007f\\]/.test(href) || href.startsWith("//")) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
    try {
      const url = new URL(href);
      if (!["http:", "https:"].includes(url.protocol)) return null;
      if (["127.0.0.1", "localhost"].includes(url.hostname) && url.port === "4173") {
        return (url.pathname.replace(/^\//, "") || "index.html") + url.search + url.hash;
      }
      return href;
    } catch {
      return null;
    }
  }
  return href;
}

function inline(markdown) {
  const tokens = /`([^`\n]+)`|\*\*([^\n]+?)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  let html = "";
  let cursor = 0;
  for (const match of markdown.matchAll(tokens)) {
    html += escapeHtml(markdown.slice(cursor, match.index));
    if (match[1] !== undefined) html += `<code>${escapeHtml(match[1])}</code>`;
    else if (match[2] !== undefined) html += `<strong>${inline(match[2])}</strong>`;
    else if (match[3] !== undefined) html += `<em>${inline(match[3])}</em>`;
    else {
      const href = safeHref(match[5]);
      html += href === null
        ? inline(match[4])
        : `<a href="${escapeHtml(href)}">${inline(match[4])}</a>`;
    }
    cursor = match.index + match[0].length;
  }
  return html + escapeHtml(markdown.slice(cursor));
}

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableStart(lines, index) {
  return lines[index]?.trim().startsWith("|")
    && lines[index + 1]?.trim().startsWith("|")
    && tableCells(lines[index + 1]).every((cell) => /^:?-{3,}:?$/.test(cell));
}

const listItem = /^\s*(-|\*|\+|\d+[.)])\s+(.+)$/;
const heading = /^(#{1,6})\s+(.+)$/;
const fence = /^```([a-z\d_-]*)\s*$/i;

function replaceStartupSection(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const start = lines.findIndex((line) => /^##\s+실행하기\s*$/.test(line));
  if (start === -1) return lines;
  let end = start + 1;
  while (end < lines.length && !/^##\s/.test(lines[end])) end += 1;
  const instructions = [
    "## 실행하기",
    "",
    "이 HTML 파일 안에 개념 본문과 설명을 확인할 예제가 들어 있습니다. 서버 실행이나 패키지 설치는 필요하지 않습니다.",
    "",
    "[차례](index.html)에서 읽을 장을 고르세요. 각 장은 개념과 작동 원리, 짧은 코드의 줄별 해설을 먼저 설명합니다. 동작 예제는 본문 뒤에 있습니다.",
    "",
    "[개념별 예제 목록](samples.html)에서는 작은 예제를 골라 해당 위치로 바로 이동할 수 있습니다.",
    "",
    "코드를 더 살펴보고 싶을 때 **코드 보기**를 사용하고 수정한 내용은 **예제에 적용**으로 실행합니다. 브라우저를 새로고침하면 수정 내용은 초기화됩니다. 개발자 도구의 document를 관찰할 때는 본문이 표시된 iframe을 선택하세요.",
    "",
    "본문의 index.html과 main.js는 원본 예제의 파일 이름입니다. 단일 파일 안의 코드 보기에서 읽고 수정할 수 있습니다.",
    "",
  ];
  lines.splice(start, end - start, ...instructions);
  return lines;
}

export function renderGuide(markdown) {
  const lines = replaceStartupSection(String(markdown));
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    if (!lines[index].trim()) { index += 1; continue; }
    const codeStart = lines[index].match(fence);
    if (codeStart) {
      const code = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      const language = codeStart[1] ? ` class="language-${escapeHtml(codeStart[1])}"` : "";
      blocks.push(`<pre><code${language}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }
    const title = lines[index].match(heading);
    if (title) {
      const level = title[1].length;
      blocks.push(`<h${level}>${inline(title[2])}</h${level}>`);
      index += 1;
      continue;
    }
    if (isTableStart(lines, index)) {
      const labels = tableCells(lines[index]);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(`<tr>${tableCells(lines[index++]).map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`);
      }
      blocks.push(`<table><thead><tr>${labels.map((label) => `<th scope="col">${inline(label)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`);
      continue;
    }
    const item = lines[index].match(listItem);
    if (item) {
      const ordered = /^\d/.test(item[1]);
      const tag = ordered ? "ol" : "ul";
      const items = [];
      while (index < lines.length) {
        const next = lines[index].match(listItem);
        if (!next || /^\d/.test(next[1]) !== ordered) break;
        items.push(`<li>${inline(next[2])}</li>`);
        index += 1;
      }
      blocks.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }
    const paragraph = [lines[index++].trim()];
    while (index < lines.length && lines[index].trim()
      && !heading.test(lines[index]) && !fence.test(lines[index])
      && !listItem.test(lines[index]) && !isTableStart(lines, index)) {
      paragraph.push(lines[index++].trim());
    }
    blocks.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>읽기 안내 · 바닐라 JS와 DOM</title><link rel="stylesheet" href="styles.css"></head>
<body><a class="skip-link" href="#main-content">본문으로 건너뛰기</a><main id="main-content" tabindex="-1"><a href="index.html">차례</a>
${blocks.join("\n")}
<nav><a href="index.html">차례로 돌아가기</a></nav>
</main></body></html>`;
}
