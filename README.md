# 바닐라 JS와 DOM

프레임워크 없이 JavaScript와 브라우저의 기본 API를 배우는 한국어 학습 프로젝트입니다. 11개 장과 35개의 작은 예제를 **개념 → 결과 예상 → 실행 → 이유 해석** 순서로 따라갑니다.

**[GitHub Pages에서 학습하기](https://jong-yu.github.io/vanilla-js/)**

## 읽기

- [읽기 안내와 용어 정리](docs/README.md)
- [개념별 예제 목록](https://jong-yu.github.io/vanilla-js/#samples.html)
- [오프라인 단일 HTML](https://jong-yu.github.io/vanilla-js/vanilla-js-dom.html)
- [장별 HTML·JavaScript 원본](docs/)

화면 위의 **코드 보기**에서 코드를 읽고 수정한 뒤 **예제에 적용**으로 실행할 수 있습니다. 수정 내용은 현재 열린 동안만 유지됩니다.

## 내용

1. 값, 변수, 함수와 실행
2. HTML에서 DOM 객체까지
3. 문서의 내용과 현재 상태
4. 이벤트가 행동을 전달하는 원리
5. DOM 트리의 생성과 변경
6. 상태와 화면의 연결
7. 브라우저의 실행 순서
8. 폼과 포커스의 기본 계약
9. 접근성의 의미와 동작
10. 동작을 재사용하는 헤드리스 구조
11. 연결과 수명

접근성 장에서는 이름·역할·상태, 네이티브 HTML, 키보드와 포커스, 펼침 영역, 상태 메시지를 개별 예제로 확인합니다.

## 실행과 배포

Node.js 18 이상을 사용하며 의존 패키지를 설치할 필요가 없습니다.

```sh
npm --prefix docs test
npm --prefix docs run build:pages
```

`docs/_site/`에 공개할 사이트가 만들어집니다. 첫 화면은 코드 편집기를 포함하며 기존 장별 주소와 `dist/vanilla-js-dom.html` 주소도 유지합니다.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs/_site
```

단일 파일만 생성하려면 `npm --prefix docs run build`를 사용합니다. 결과는 `docs/dist/vanilla-js-dom.html`입니다.

`main`의 `docs/` 파일을 변경하면 [Pages 배포 작업](.github/workflows/pages.yml)이 테스트·빌드 후 자동으로 배포합니다. GitHub 저장소의 Pages 게시 방식은 **GitHub Actions**입니다. 배포 작업은 Actions 화면에서 수동으로도 실행할 수 있습니다.

## 파일 구성

```text
.github/workflows/pages.yml # 테스트와 Pages 자동 배포
docs/
  index.html               # 교재의 첫 화면 원본
  README.md                # 학습 안내
  01-javascript/ ...       # 장별 본문과 실행 코드
  11-accessibility/        # 접근성 개념과 예제
  samples.html             # 자동 생성한 예제 목록
  shared/                  # 상태 저장소·DOM 연결 코드·테스트
  styles.css               # 공통 디자인
  standalone-shell.html    # 탐색·코드 편집 화면
  build.mjs                # 단일 HTML 생성
  build-guide.mjs          # 읽기 안내 생성
  build-samples.mjs        # 실제 예제에서 목록 생성
  build-pages.mjs          # 공개 파일만 _site에 구성
  dist/vanilla-js-dom.html # 다운로드용 단일 HTML
```

장별 폴더 이름은 기존 경로를 유지합니다. 실제 읽기 순서는 교재의 차례를 따릅니다.
