const username = document.querySelector("#username");
const notifications = document.querySelector("#notifications");
const preview = document.querySelector("#preview");
const snapshot = document.querySelector("#snapshot");
const applyButton = document.querySelector("#apply");
const changeValuesButton = document.querySelector("#change-values");

function updatePreview() {
  // value와 checked는 지금 입력창과 체크박스에 들어 있는 값입니다.
  const name = username.value || "이름 없음";
  const enabled = notifications.checked;

  preview.textContent = `${name}님, 이메일 알림이 ${enabled ? "켜져" : "꺼져"} 있어요.`;
  preview.dataset.notifications = enabled ? "on" : "off";
  preview.classList.toggle("status", enabled);

  // JSON.stringify는 객체를 읽기 편한 문자열로 바꿉니다.
  snapshot.textContent = JSON.stringify({
    "username.value (현재 값)": username.value,
    "username.getAttribute('value') (HTML 속성)": username.getAttribute("value"),
    "notifications.checked (현재 선택)": notifications.checked,
    "notifications.defaultChecked (기본 선택)": notifications.defaultChecked,
    "notifications.hasAttribute('checked')": notifications.hasAttribute("checked"),
    "preview.dataset.notifications": preview.dataset.notifications,
    "preview.className": preview.className,
  }, null, 2);
}

// 버튼과 함수를 연결하는 addEventListener는 다음 실습에서 살펴봅니다.
applyButton.addEventListener("click", updatePreview);

changeValuesButton.addEventListener("click", () => {
  username.value = "지우";
  notifications.checked = false;
  // 프로퍼티 대입과 별도로, 안내 문구를 바꾸는 함수도 실행합니다.
  updatePreview();
});

updatePreview();
