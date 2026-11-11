import assert from "node:assert/strict";
import test from "node:test";
import { createSwitchStore } from "./switch-store.js";

test("상태는 변경 전까지 같은 읽기 전용 객체를 반환한다", () => {
  const store = createSwitchStore();
  const initial = store.getState();

  assert.deepEqual(initial, { checked: false });
  assert.equal(store.getState(), initial);
  assert.throws(() => { initial.checked = true; }, TypeError);

  store.setChecked(true);
  assert.notEqual(store.getState(), initial);
  assert.deepEqual(store.getState(), { checked: true });
  assert.deepEqual(initial, { checked: false });
  assert.ok(Object.isFrozen(store.getState()));
});

test("구독은 실제 값 변경 때만 새 상태를 전달한다", () => {
  const store = createSwitchStore();
  const received = [];
  store.subscribe((state) => received.push(state));

  assert.equal(received.length, 0);
  store.setChecked(false);
  assert.equal(received.length, 0);

  store.setChecked(true);
  assert.equal(received.length, 1);
  assert.equal(received[0], store.getState());
  store.setChecked(true);
  assert.equal(received.length, 1);

  store.setChecked(false);
  assert.deepEqual(received, [{ checked: true }, { checked: false }]);
});

test("구독 해제는 여러 번 호출해도 다른 구독에 영향을 주지 않는다", () => {
  const store = createSwitchStore();
  let firstCount = 0;
  let secondCount = 0;
  const unsubscribe = store.subscribe(() => firstCount++);
  store.subscribe(() => secondCount++);

  store.setChecked(true);
  unsubscribe();
  unsubscribe();
  store.setChecked(false);

  assert.equal(firstCount, 1);
  assert.equal(secondCount, 2);
});

test("reset은 생성 당시 기본값으로 돌아가며 불필요한 알림을 보내지 않는다", () => {
  const store = createSwitchStore(true);
  let count = 0;
  store.subscribe(() => count++);

  store.reset();
  assert.equal(count, 0);
  store.setChecked(false);
  store.reset();
  assert.deepEqual(store.getState(), { checked: true });
  assert.equal(count, 2);
  store.reset();
  assert.equal(count, 2);
});

test("별도로 만든 저장소는 서로의 상태를 바꾸지 않는다", () => {
  const first = createSwitchStore();
  const second = createSwitchStore();
  first.setChecked(true);

  assert.equal(first.getState().checked, true);
  assert.equal(second.getState().checked, false);
});

test("boolean이 아닌 값은 상태를 바꾸지 않고 거부한다", () => {
  assert.throws(() => createSwitchStore("false"), TypeError);
  const store = createSwitchStore();
  const initial = store.getState();
  assert.throws(() => store.setChecked(1), TypeError);
  assert.equal(store.getState(), initial);
});
