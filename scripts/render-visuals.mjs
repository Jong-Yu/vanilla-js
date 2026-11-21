// 본문의 실제 SVG 도식과 앵커를 읽어 별도의 학습 도식 차례를 만듭니다.
// 그림의 제목이나 설명을 고쳐도 목록을 따로 관리할 필요가 없습니다.
export function collectVisuals(html) {
  const visuals = [];
  for (const figure of html.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)) {
    const [, attributes, content] = figure;
    if (!/<svg\b/.test(content)) continue;
    const caption = content.match(/<figcaption\b([^>]*)>([\s\S]*?)<\/figcaption>/);
    const id = attributes.match(/\bid="([^"]+)"/)?.[1]
      || caption?.[1].match(/\bid="([^"]+)"/)?.[1];
    if (!id || !/^[a-z][a-z0-9-]*$/.test(id) || !caption) {
      throw new Error("학습 도식에는 고유한 id와 figcaption이 필요합니다.");
    }
    const summary = content.match(/<p\b[^>]*class="diagram-summary"[^>]*>([\s\S]*?)<\/p>/)?.[1]
      || content.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1]
      || "그림과 본문을 함께 읽으며 개념의 연결을 따라가 보세요.";
    // 인라인 태그만 제거하고 기존 HTML 문자 엔티티는 보존합니다.
    const plain = text => text.replace(/<[^>]+>/g, "");
    visuals.push({ id, title: plain(caption[2]), summary: plain(summary) });
  }
  if (new Set(visuals.map(visual => visual.id)).size !== visuals.length) {
    throw new Error("학습 도식의 id가 중복되었습니다.");
  }
  return visuals;
}

export function renderVisuals(lessons, files) {
  const chapters = [["", "들어가며 · 코드와 화면의 연결"], ...lessons].map(([directory, label]) => ({
    directory, label,
    path: directory ? `${directory}/index.html` : "index.html",
    anchor: directory.split("/").at(-1) || "introduction",
    visuals: collectVisuals(files[directory ? `${directory}/index.html` : "index.html"]),
  }));
  const total = chapters.reduce((sum, chapter) => sum + chapter.visuals.length, 0);
  const sections = chapters.map(({ label, path, anchor, visuals }) => `
<section class="concept" id="${anchor}"><h2>${label} <span class="visual-count">· ${visuals.length}개 도식</span></h2>
<ul class="visual-index">${visuals.map(({ id, title, summary }) => `
<li><a href="${path}#${id}"><strong>${title}</strong><span>${summary}</span></a></li>`).join("")}</ul></section>`).join("\n");
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>학습 도식 모아보기 · 바닐라 JS와 DOM</title><link rel="stylesheet" href="styles.css"></head>
<body><a class="skip-link" href="#main-content">본문으로 건너뛰기</a><main id="main-content" tabindex="-1">
<header><a href="index.html">차례</a><p class="eyebrow">VISUAL GUIDE / 그림으로 연결하기</p><h1>눈으로 따라가면,<br>코드의 흐름이 보입니다</h1><p class="intro">${total}개의 학습 도식으로 값, 문서, 실행 순서를 연결합니다. 궁금한 그림을 고르면 해당 본문으로 이동합니다.</p></header>
<section class="learning-goals" aria-labelledby="visual-reading-title"><h2 id="visual-reading-title">그림을 읽는 세 가지 질문</h2><p><strong>무엇을 가리킬까?</strong> 상자와 연결선을 따라 객체의 관계를 읽습니다. <strong>언제 달라질까?</strong> 시간 순서와 변경 전후를 비교합니다. <strong>무엇이 그대로일까?</strong> 바뀐 값 옆에 남아 있는 값도 확인합니다.</p></section>
<nav class="chapter-toc" aria-label="장별 학습 도식">${chapters.map(({ label, anchor }) => `<a href="#${anchor}">${label}</a>`).join("")}</nav>
${sections}
<nav aria-label="학습 안내"><a href="index.html">차례로 돌아가기</a><a href="samples.html">개념별 실행 예제</a></nav>
</main></body></html>`;
}
