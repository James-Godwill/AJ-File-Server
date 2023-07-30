/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
console.log('Inside javascript');

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

    console.log(res);
  } catch (err) {
    console.log(err);
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
