import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderGuide } from "./build-guide.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const lessons = [
  ["01-javascript", "1장 · 값, 변수, 함수와 실행"],
  ["02-dom", "2장 · HTML에서 DOM 객체까지"],
  ["03-dom-update", "3장 · 문서의 내용과 현재 상태"],
  ["04-events", "4장 · 이벤트가 전달되는 원리"],
  ["05-dom-create", "5장 · DOM 트리의 생성과 변경"],
  ["06-state-render", "6장 · 상태와 화면의 연결"],
  ["09-browser-runtime", "7장 · 브라우저의 실행 순서"],
  ["10-focus-forms", "8장 · 폼과 포커스의 기본 계약"],
  ["07-headless", "9장 · 동작을 재사용하는 구조"],
  ["08-lifecycle", "10장 · 연결과 수명"],
];
const paths = [
  "index.html", "styles.css", "shared/switch-store.js", "shared/bind-switch.js",
  ...lessons.flatMap(([dir]) => [`${dir}/index.html`, `${dir}/main.js`]),
];
const files = Object.fromEntries(await Promise.all(paths.map(async path => [
  path, await readFile(join(root, path), "utf8"),
])));

// 원본의 서버 안내만 단일 파일용 안내로 바꿉니다. 실습 구현은 그대로 포함합니다.
files["index.html"] = files["index.html"]
  .replace(/<details id="open-guide">[\s\S]*?<\/details>/, `<details id="open-guide"><summary>파일과 예제 이용 안내</summary>
<p>인터넷 연결이나 서버 없이 이 HTML 파일 하나를 브라우저에서 열면 됩니다.</p>
<p>본문을 읽은 다음 각 장 뒤의 예제로 설명한 흐름을 확인할 수 있습니다. 위쪽의 <strong>코드 보기</strong>에서 HTML·CSS·JavaScript를 읽고 수정한 다음 <strong>예제에 적용</strong>을 누르면 됩니다. 수정 내용은 현재 열린 동안만 유지되며, 파일을 다시 열거나 새로고침하면 원본으로 돌아갑니다.</p>
<p><strong>예제 다시 시작</strong>은 수정한 코드를 유지한 채 현재 예제의 동작 상태만 초기화합니다. 개발자 도구를 사용할 때는 본문이 표시된 프레임을 선택하세요.</p></details>`)
  .replace('href="README.md"', 'href="guide.html"');
files["guide.html"] = renderGuide(await readFile(join(root, "README.md"), "utf8"));

const shell = await readFile(join(root, "standalone-shell.html"), "utf8");
// </script> 등의 문자열이 데이터 블록을 닫지 못하도록 HTML 문자를 이스케이프합니다.
const data = JSON.stringify({ files, lessons }).replace(/</g, "\\u003c");
const html = shell.replace("__COURSE_DATA__", () => data);
await mkdir(join(root, "dist"), { recursive: true });
const output = join(root, "dist/vanilla-js-dom.html");
await writeFile(output, html);
console.log(`${output}\n${(Buffer.byteLength(html) / 1024).toFixed(1)} KB · ${lessons.length} lessons · no external runtime dependencies`);
