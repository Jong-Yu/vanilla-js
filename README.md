# 바닐라 JS와 DOM

JavaScript와 브라우저의 기본 동작을 배우는 11개 장, 35개 실행 예제입니다. 각 장은 개념 설명과 짧은 코드 해설, 직접 조작하는 예제로 구성됩니다.

[온라인 교재](https://jong-yu.github.io/vanilla-js/) · [읽기 안내와 용어](docs/guide.md)

## 실행

Node.js 18 이상이 필요합니다. 외부 패키지 설치 없이 실행합니다.

```sh
npm test
npm run build
```

빌드한 `dist/vanilla-js-dom.html`을 브라우저에서 열면 인터넷이나 서버 없이 교재를 읽고 예제 코드를 수정할 수 있습니다.

배포용 페이지를 로컬에서 확인하려면 다음 명령을 실행하고 [로컬 페이지](http://127.0.0.1:4173)를 엽니다.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/site
```

## 디렉토리

```text
src/
  index.html              교재 차례
  styles.css              공통 스타일
  standalone-shell.html   단일 HTML의 탐색·코드 편집 화면
  lessons/                학습 순서에 맞춘 01–11장
  shared/                 예제에서 공유하는 상태·DOM 연결 코드
scripts/                  빌드와 HTML 생성
tests/                    상태 저장소 테스트
docs/guide.md             읽기 안내와 용어
dist/                     자동 생성되는 결과물 (Git 제외)
  vanilla-js-dom.html      오프라인용 단일 HTML
  site/                   GitHub Pages 배포 파일
```

## 수정과 배포

- 본문과 예제는 `src/lessons/`의 각 장에 있는 `index.html`, `main.js`를 수정합니다.
- 공통 화면은 `src/styles.css`, 상태와 DOM 연결은 `src/shared/`에서 수정합니다.
- 읽기 안내는 `docs/guide.md`에서 수정합니다. 예제 목록은 각 장의 `class="sample"` 섹션 제목으로 생성됩니다.
- 수정 후 `npm test`와 `npm run build`를 실행합니다. `dist/` 안의 파일은 직접 수정하지 않습니다.

`npm run build`는 단일 HTML과 배포 파일을 함께 생성합니다. `npm run build:pages`도 같은 명령의 호환 별칭입니다. `main`의 교재 파일이 변경되면 GitHub Actions가 루트에서 테스트와 빌드를 실행하고 `dist/site/`를 배포합니다. GitHub Pages의 게시 방식은 **GitHub Actions**를 사용합니다.
