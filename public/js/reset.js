/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
console.log('Inside javascript');
const url = window.location.href;

console.log(url);
const resetPassword = async (password, passwordConfirm) => {
  //Using axios to make our api requests
  try {
    const res = await axios({
      method: 'PATCH',
      url: url,
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alert('Password Reset Successful');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);

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
