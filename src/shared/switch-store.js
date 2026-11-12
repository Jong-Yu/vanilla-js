// 이 파일은 DOM을 읽거나 바꾸지 않습니다. 값 저장과 변경 알림만 관리합니다.
export function createSwitchStore(initialChecked = false) {
  if (typeof initialChecked !== "boolean") {
    throw new TypeError("initialChecked는 boolean이어야 합니다.");
  }

  // 상태를 직접 고치지 못하도록 고정합니다. 값이 바뀔 때 새 객체를 만듭니다.
  let state = Object.freeze({ checked: initialChecked });
  const listeners = new Set();

  function getState() {
    // 읽을 때마다 새 객체를 만들지 않습니다. 상태가 같으면 같은 객체입니다.
    return state;
  }

  function setChecked(checked) {
    if (typeof checked !== "boolean") {
      throw new TypeError("checked는 boolean이어야 합니다.");
    }
    if (state.checked === checked) return;

    state = Object.freeze({ checked });
    for (const listener of listeners) {
      listener(state);
    }
  }

  function subscribe(listener) {
    listeners.add(listener);
    // 등록 시에는 호출하지 않습니다. 첫 화면을 그리는 일은 연결 코드가 합니다.
    return () => listeners.delete(listener);
  }

  function reset() {
    setChecked(initialChecked);
  }

  return { getState, setChecked, subscribe, reset };
}
