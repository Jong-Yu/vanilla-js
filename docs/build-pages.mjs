import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lessons } from "./build.mjs";
import { renderGuide } from "./build-guide.mjs";

const root = dirname(fileURLToPath(import.meta.url));
// _site는 Pages에 올릴 파일만 모으는 생성 폴더입니다.
const output = join(root, "_site");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const standalone = join(root, "dist/vanilla-js-dom.html");
await copyFile(standalone, join(output, "index.html"));
await copyFile(standalone, join(output, "vanilla-js-dom.html"));

// 이전에 공유한 장별 주소와 단일 파일 주소도 계속 사용할 수 있습니다.
const files = [
  "styles.css", "samples.html", "README.md", "dist/vanilla-js-dom.html",
  "shared/switch-store.js", "shared/bind-switch.js",
  ...lessons.flatMap(([directory]) => [`${directory}/index.html`, `${directory}/main.js`]),
];
for (const file of files) {
  await mkdir(dirname(join(output, file)), { recursive: true });
  await copyFile(join(root, file), join(output, file));
}
await writeFile(join(output, "guide.html"), renderGuide(await readFile(join(root, "README.md"), "utf8")));
await writeFile(join(output, ".nojekyll"), "");
console.log(`${output}\nGitHub Pages entry + ${lessons.length} chapter URLs`);
