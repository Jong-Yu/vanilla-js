// 예제 카드의 제목·주제·예상 질문은 실제 .sample 섹션에서 읽습니다.
// 본문의 레이아웃이 바뀌어도 예제 안에서만 내용을 찾습니다.
export function collectSamples(html) {
  const samples = [];
  const sections = /<section\b([^>]*)>/g;
  for (const section of html.matchAll(sections)) {
    const attributes = section[1];
    const classes = attributes.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) || [];
    if (!classes.includes("sample")) continue;
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const start = section.index + section[0].length;
    const boundaries = /<\/?section\b[^>]*>/g;
    boundaries.lastIndex = start;
    let depth = 1;
    let end = html.length;
    let boundary;
    while ((boundary = boundaries.exec(html))) {
      depth += boundary[0].startsWith("</") ? -1 : 1;
      if (depth === 0) { end = boundary.index; break; }
    }
    const content = html.slice(start, end);
    const heading = content.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/);
    if (!id || !/^sample-[a-z0-9-]+$/.test(id) || !heading) {
      throw new Error("예제에는 sample-으로 시작하는 id와 첫 제목 h3가 필요합니다.");
    }
    // HTML 문자 엔티티는 유지해 코드 예시가 태그로 해석되지 않게 합니다.
    const plain = value => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const paragraph = className => {
      for (const match of content.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)) {
        const classes = match[1].match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) || [];
        if (classes.includes(className)) return match[2];
      }
      return "";
    };
    const meta = plain(paragraph("sample-meta"));
    const [number, topic = ""] = meta.split(/\s*·\s*/);
    const prediction = plain(paragraph("prediction").replace(/^\s*<strong\b[^>]*>[\s\S]*?<\/strong>\s*/, ""));
    samples.push({ id, title: plain(heading[1]), meta, number, topic, prediction });
  }
  if (new Set(samples.map(sample => sample.id)).size !== samples.length) {
    throw new Error("예제 id가 중복되었습니다.");
  }
  return samples;
}

export function renderSamples(lessons, files) {
  const descriptions = {
    "01-javascript": "값을 보관하고 함수를 호출하면서, 무엇이 복사되고 무엇이 함께 바뀌는지 확인합니다.",
    "02-dom": "문서에서 찾은 요소, 읽어 둔 문자열, 요소 목록을 비교하며 DOM 객체의 성격을 익힙니다.",
    "03-dom-update": "내용과 현재 값을 바꾸고, HTML의 기본값과 화면 표현이 어떻게 연결되는지 살펴봅니다.",
    "04-events": "클릭과 키보드 입력을 관찰하며 호출 시점, 전달 경로, 브라우저 기본 동작을 구분합니다.",
    "05-dom-create": "요소를 만들고 붙이고 옮겨 봅니다. 동적으로 생긴 버튼까지 같은 규칙으로 다뤄 봅니다.",
    "06-state-render": "원본 상태 하나를 여러 모습으로 표현하고, 화면을 다시 그릴 때 남겨야 할 것을 찾습니다.",
    "07-browser-runtime": "실행 기록과 화면을 비교하며 동기 코드, 예약된 작업, DOM 갱신의 순서를 읽습니다.",
    "08-focus-forms": "Tab으로 이동하고 폼을 제출해 보며 포커스, 수집되는 값, 초기화와 검증을 확인합니다.",
    "09-accessibility": "키보드 조작과 이름·역할·상태를 함께 확인하고, 변화가 어떻게 전달되는지 살펴봅니다.",
    "10-headless": "같은 상태를 두 화면에 연결해 보며 저장소, 변경 알림, 표현의 책임을 나눕니다.",
    "11-lifecycle": "연결을 끊은 뒤에도 남는 동작을 관찰하며 등록한 함수와 자원을 정리하는 이유를 이해합니다.",
  };
  const tracks = [
    { id: "track-foundations", title: "값과 문서를 다루기", range: "1–3장", start: 0, end: 3, description: "변수에서 DOM까지, 코드가 다루는 대상부터 구분합니다." },
    { id: "track-interactions", title: "변화의 흐름 따라가기", range: "4–7장", start: 3, end: 7, description: "입력이 상태를 바꾸고 화면에 닿는 과정을 실험합니다." },
    { id: "track-interfaces", title: "사용할 수 있는 UI 만들기", range: "8–11장", start: 7, end: 11, description: "폼과 접근성을 지키며 동작을 연결하고 정리합니다." },
  ];
  const chapters = lessons.map(([directory, label]) => ({
    directory, label,
    anchor: directory.split("/").at(-1),
    description: descriptions[directory.split("/").at(-1)] || "작은 실험으로 이 장의 핵심 개념을 확인합니다.",
    samples: collectSamples(files[`${directory}/index.html`]),
  }));
  const total = chapters.reduce((sum, chapter) => sum + chapter.samples.length, 0);
  const chapterSection = ({ directory, label, anchor, description, samples }) => `
<section class="sample-chapter" id="${anchor}" aria-labelledby="${anchor}-title">
<header class="sample-chapter-heading"><div><h3 id="${anchor}-title"><a href="${directory}/">${label}</a></h3><p class="sample-chapter-description">${description}</p></div><span class="sample-count">${samples.length}개 예제</span></header>
<ul class="sample-index">${samples.map(({ id, title, number, topic, prediction }) => `
<li><a class="sample-card-link" href="${directory}/#${id}"><span class="sample-card-meta"><span class="sample-card-number">${number}</span>${topic ? `<span class="sample-card-topic">${topic}</span>` : ""}</span><h4 class="sample-card-title">${title}</h4>${prediction ? `<p class="sample-card-prediction">${prediction}</p>` : ""}<span class="sample-card-action">예제 열기</span></a></li>`).join("")}</ul>
</section>`;
  const sections = tracks.map(({ id, title, range, start, end, description }) => `
<section class="sample-track" id="${id}" aria-labelledby="${id}-title"><div class="sample-track-heading"><p class="eyebrow">${range}</p><h2 id="${id}-title">${title}</h2><p class="sample-track-description">${description}</p></div>
${chapters.slice(start, end).map(chapterSection).join("\n")}</section>`).join("\n");
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>개념별 예제 찾기 · 바닐라 JS와 DOM</title><link rel="stylesheet" href="styles.css"></head>
<body><a class="skip-link" href="#main-content">본문으로 건너뛰기</a><main class="sample-library" id="main-content" tabindex="-1">
<header class="sample-catalog-hero"><a href="index.html">차례</a><p class="eyebrow">PRACTICE LIBRARY / 질문에서 시작하는 실험</p><h1>하나씩 실행하며,<br>웹의 원리를 익혀보세요</h1><p class="intro">지금 궁금한 주제에서 시작하세요. 결과를 예상한 뒤 코드를 읽고, 직접 조작하며 달라진 이유를 확인합니다.</p><p class="sample-catalog-stats"><span><strong>${total}</strong>개의 작은 실험</span><span><strong>${lessons.length}</strong>개의 학습 주제</span></p></header>
<nav class="sample-track-links" aria-label="학습 주제로 찾기">${tracks.map(({ id, title, range, description }) => `<a href="#${id}"><small>${range}</small><strong>${title}</strong><span>${description}</span></a>`).join("")}</nav>
<details class="sample-catalog-nav"><summary>장별 예제 바로 찾기</summary><nav class="chapter-toc" aria-label="장별 예제 목록">${chapters.map(({ label, anchor }) => `<a href="#${anchor}">${label}</a>`).join("")}</nav></details>
${sections}
<nav aria-label="학습 안내"><a href="index.html">차례로 돌아가기</a><a href="guide.html">읽기 안내와 용어</a></nav>
</main></body></html>`;
}
