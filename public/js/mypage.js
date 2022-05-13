const removeReadonlyAttribute = (input) => {
  input.removeAttribute('readonly');
};

const updateBtn = document.querySelector('.update-user-btn');

const inputGroup = {};
// inputGroup['code'] = document.querySelector('.code');
inputGroup['grade'] = document.querySelector('.grade');
inputGroup['email'] = document.querySelector('.email');
inputGroup['name'] = document.querySelector('.name');

updateBtn.addEventListener('click', (event) => {
  event.preventDefault();
  for (let key in inputGroup) {
    removeReadonlyAttribute(inputGroup[key]);
  }

  updateBtn.outerHTML =
    '<button class="update-user-btn btn btn-primary p-2">수정 완료</button>';
  // updateButton.innerText = '수정 완료';
});
