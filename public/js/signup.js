/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

const signup = async (username, email, password, passwordConfirm) => {
  //Using axios to make our api requests
  console.log(email);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/aj/api/v1/users/signup',
      data: {
        name: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alert('Account Creation Successful');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('confirm-password').value;
  const username = document.getElementById('username').value;

  signup(username, email, password, passwordConfirm);
});
