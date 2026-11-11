# JavaScript와 DOM

바닐라 JavaScript와 DOM을 개념부터 설명하는 한국어 교재입니다. 정의와 필요성, 작동 원리, 짧은 코드의 줄별 해설을 먼저 읽고, 장 뒤의 실행 예제로 동작을 확인할 수 있습니다.

## 읽기

- [읽기 안내와 용어 정리](docs/README.md)
- [단일 HTML 교재](docs/dist/vanilla-js-dom.html) — GitHub 파일 화면에서 **Download raw file**로 저장한 뒤 브라우저에서 엽니다. 본문·CSS·JavaScript·예제가 모두 포함되어 있어 별도 서버가 필요하지 않습니다.
- [장별 원본](docs/) — HTML과 JavaScript를 나누어 읽거나 수정할 때 사용합니다.

단일 HTML의 **코드 보기**에서 예제 코드를 살펴보고 **예제에 적용**으로 수정 내용을 실행할 수 있습니다. 수정 내용은 현재 열린 동안만 유지됩니다.

## 내용

1. 값, 변수, 함수와 실행
2. HTML에서 DOM 객체까지
3. 문서의 내용과 현재 상태
4. 이벤트가 행동을 전달하는 원리
5. DOM 트리의 생성과 변경
6. 상태와 화면의 연결
7. 브라우저의 실행 순서
8. 폼과 포커스의 기본 계약
9. 동작을 재사용하는 헤드리스 구조
10. 연결과 수명

## 원본 실행과 빌드

Node.js로 단일 파일을 다시 생성합니다. 의존 패키지 설치는 필요하지 않습니다.

```sh
node docs/build.mjs
```

출력 파일은 `docs/dist/vanilla-js-dom.html`입니다. 장별 원본을 브라우저에서 실행하려면 저장소 루트에서 다음을 실행합니다.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. 원본의 마지막 두 장은 ES module을 사용하므로 로컬 서버로 실행합니다.

상태 저장소 테스트는 Node.js의 기본 테스트 실행기를 사용합니다.

```sh
node --test docs/shared/switch-store.test.mjs
```

## 파일 구성

```text
docs/
  index.html               # 들어가며와 차례
  README.md                # 읽기 안내와 용어 정리
  01-javascript/ ...       # 장별 본문과 실행 코드
  shared/                  # 상태 저장소·DOM 연결 코드·테스트
  styles.css               # 공통 표현
  build.mjs                # 단일 HTML 생성
  build-guide.mjs          # 읽기 안내를 HTML로 변환
  standalone-shell.html    # 단일 파일의 탐색·코드 보기 화면
  dist/vanilla-js-dom.html  # 배포용 단일 HTML
```

장별 폴더 이름은 원본 경로를 유지합니다. 실제 읽기 순서는 교재의 차례에 안내되어 있습니다.
