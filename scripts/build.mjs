import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderGuide } from "./render-guide.mjs";
import { renderSamples } from "./render-samples.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");

// 이전 공개 주소, 실제 소스 디렉토리, 차례 제목을 한곳에서 관리합니다.
const chapters = [
  ["01-javascript", "01-javascript", "1장 · 값, 변수, 함수와 실행"],
  ["02-dom", "02-dom", "2장 · HTML에서 DOM 객체까지"],
  ["03-dom-update", "03-dom-update", "3장 · 문서의 내용과 현재 상태"],
  ["04-events", "04-events", "4장 · 이벤트가 전달되는 원리"],
  ["05-dom-create", "05-dom-create", "5장 · DOM 트리의 생성과 변경"],
  ["06-state-render", "06-state-render", "6장 · 상태와 화면의 연결"],
  ["09-browser-runtime", "07-browser-runtime", "7장 · 브라우저의 실행 순서"],
  ["10-focus-forms", "08-focus-forms", "8장 · 폼과 포커스의 기본 계약"],
  ["11-accessibility", "09-accessibility", "9장 · 접근성의 의미와 동작"],
  ["07-headless", "10-headless", "10장 · 동작을 재사용하는 구조"],
  ["08-lifecycle", "11-lifecycle", "11장 · 연결과 수명"],
];
const lessons = chapters.map(([, directory, label]) => [`lessons/${directory}`, label]);
const aliases = Object.fromEntries(chapters.map(([previous, directory]) => [
  `${previous}/index.html`, `lessons/${directory}/index.html`,
]));
aliases["01-native-html/index.html"] = "lessons/01-javascript/index.html";
aliases["03-events/index.html"] = "lessons/04-events/index.html";

const paths = [
  "index.html", "styles.css", "shared/switch-store.js", "shared/bind-switch.js",
  ...lessons.flatMap(([directory]) => [`${directory}/index.html`, `${directory}/main.js`]),
];
const files = Object.fromEntries(await Promise.all(paths.map(async path => [
  path, await readFile(join(root, "src", path), "utf8"),
])));
files["samples.html"] = renderSamples(lessons, files);
// 저장소에서 읽는 Markdown 링크를 배포 사이트와 단일 파일의 경로로 맞춥니다.
const guide = (await readFile(join(root, "docs/guide.md"), "utf8"))
  .replaceAll("](../src/", "](")
  .replaceAll("](../dist/site/", "](")
  .replaceAll("](../dist/vanilla-js-dom.html)", "](index.html)");
files["guide.html"] = renderGuide(guide);

files["index.html"] = files["index.html"].replace(
  /<details id="open-guide">[\s\S]*?<\/details>/,
  `<details id="open-guide"><summary>파일과 예제 이용 안내</summary>
<p>인터넷 연결이나 서버 없이 이 HTML 파일 하나를 브라우저에서 열면 됩니다.</p>
<p>본문을 읽은 다음 각 장 뒤의 예제로 설명한 흐름을 확인할 수 있습니다. 위쪽의 <strong>코드 보기</strong>에서 HTML·CSS·JavaScript를 읽고 수정한 다음 <strong>예제에 적용</strong>을 누르면 됩니다. 수정 내용은 현재 열린 동안만 유지되며, 파일을 다시 열거나 새로고침하면 원본으로 돌아갑니다.</p>
<p><strong>예제 다시 시작</strong>은 수정한 코드를 유지한 채 현재 예제의 동작 상태만 초기화합니다. 개발자 도구를 사용할 때는 본문이 표시된 프레임을 선택하세요.</p></details>`,
);

const shell = await readFile(join(root, "src/standalone-shell.html"), "utf8");
// </script> 등의 문자열이 데이터 블록을 닫지 못하도록 이스케이프합니다.
const data = JSON.stringify({ files, lessons, aliases }).replace(/</g, "\\u003c");
const standalone = shell.replace("__COURSE_DATA__", () => data);

// 생성 파일은 dist 안에서만 쓰고, 이전 빌드의 파일은 남기지 않습니다.
await rm(output, { recursive: true, force: true });
async function emit(path, contents) {
  const target = join(output, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}
await emit("vanilla-js-dom.html", standalone);
for (const [path, contents] of Object.entries(files)) {
  await emit(`site/${path}`, path === "index.html" ? standalone : contents);
}
await emit("site/vanilla-js-dom.html", standalone);
await emit("site/dist/vanilla-js-dom.html", standalone);
await emit("site/.nojekyll", "");

// 소스에 구버전 폴더를 남기지 않고도 기존 장별 링크와 예제 앵커를 보존합니다.
for (const [previous, current] of Object.entries(aliases)) {
  const target = `../${current}`;
  await emit(`site/${previous}`, `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>장으로 이동</title>
<meta http-equiv="refresh" content="0;url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head><body><a href="${target}">이어서 읽기</a></body></html>`);
}
console.log(`dist/vanilla-js-dom.html · ${(Buffer.byteLength(standalone) / 1024).toFixed(1)} KB · ${lessons.length} lessons`);
console.log("dist/site/ · GitHub Pages");
