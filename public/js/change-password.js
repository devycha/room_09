const removeReadonlyAttribute = (input) => {
  input.removeAttribute('readonly');
};

const setRequiredAttribute = (input) => {
  input.setAttribute('required', '');
};

const changePasswordBtn = document.querySelector('.change-password-btn');

const changePasswordInputs = document.querySelectorAll('.password');

changePasswordBtn.addEventListener('click', (event) => {
  event.preventDefault();
  changePasswordInputs.forEach((input) => {
    removeReadonlyAttribute(input);
    setRequiredAttribute(input);
  });

  changePasswordBtn.outerHTML =
    '<button class="change-password-btn btn btn-primary p-2">변경 완료</button>';
});
