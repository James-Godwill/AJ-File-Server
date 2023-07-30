/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
console.log('Inside javascript');

const resetPassword = async (password, passwordConfirm) => {
  //Using axios to make our api requests
  console.log(email);
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/aj/api/v1/users/signup',
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('confirm-password').value;

  resetPassword(password, passwordConfirm);
});
