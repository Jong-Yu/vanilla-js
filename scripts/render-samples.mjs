// 예제 제목과 주소는 각 장의 실제 .sample 섹션에서 읽습니다.
// 장을 고칠 때 별도 목록에 제목을 중복 입력하지 않아도 됩니다.
export function collectSamples(html) {
  const samples = [];
  const sections = /<section\b([^>]*)>/g;
  for (const section of html.matchAll(sections)) {
    const attributes = section[1];
    const classes = attributes.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) || [];
    if (!classes.includes("sample")) continue;
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const content = html.slice(section.index + section[0].length);
    const heading = content.match(/^\s*(?:<p\b[^>]*>[\s\S]*?<\/p>\s*)?<h3\b[^>]*>([\s\S]*?)<\/h3>/);
    if (!id || !/^sample-[a-z0-9-]+$/.test(id) || !heading) {
      throw new Error("예제에는 sample-으로 시작하는 id와 첫 제목 h3가 필요합니다.");
    }
    // HTML 제목의 인라인 태그만 제거하며 원래의 문자 엔티티는 보존합니다.
    samples.push({ id, title: heading[1].replace(/<[^>]+>/g, "") });
  }
  if (new Set(samples.map(sample => sample.id)).size !== samples.length) {
    throw new Error("예제 id가 중복되었습니다.");
  }
  return samples;
}

export function renderSamples(lessons, files) {
  const chapters = lessons.map(([directory, label]) => ({
    directory, label, samples: collectSamples(files[`${directory}/index.html`]),
  }));
  const total = chapters.reduce((sum, chapter) => sum + chapter.samples.length, 0);
  const sections = chapters.map(({ directory, label, samples }) => `
<section class="concept" id="${directory.split("/").at(-1)}"><h2><a href="${directory}/">${label}</a></h2>
<ul class="sample-index">${samples.map(({ id, title }) => `
<li><a href="${directory}/#${id}">${title}<small>질문 → 실행 → 결과 해석</small></a></li>`).join("")}</ul></section>`).join("\n");
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>개념별 예제 찾기 · 바닐라 JS와 DOM</title><link rel="stylesheet" href="styles.css"></head>
<body><a class="skip-link" href="#main-content">본문으로 건너뛰기</a><main id="main-content" tabindex="-1">
<header><a href="index.html">차례</a><p class="eyebrow">SAMPLE INDEX / 한 번에 한 가지 개념</p><h1>작게 실행하고,<br>이유를 설명해보세요</h1><p class="intro">${lessons.length}개 장, ${total}개의 독립 예제. 제목을 누르면 해당 예제로 바로 이동합니다. 처음 접하는 개념은 그 장의 본문을 먼저 읽어도 좋습니다.</p></header>
<nav class="chapter-toc" aria-label="장별 예제 목록">${chapters.map(({ directory, label }) => `<a href="#${directory.split("/").at(-1)}">${label}</a>`).join("")}</nav>
<p class="note">실행 전에 결과를 예상하고, 한 가지 조작을 한 뒤 예상과 다른 이유를 찾아보세요. 각 예제는 자신의 상태를 사용합니다. 같은 예제 안에서 두 화면이 상태를 공유하는 경우에는 본문에 명시했습니다.</p>
${sections}
<nav aria-label="학습 안내"><a href="index.html">차례로 돌아가기</a><a href="guide.html">읽기 안내와 용어</a></nav>
</main></body></html>`;
}
