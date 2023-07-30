/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
console.log('Inside javascript');

const signIn = async (email, password) => {
  //Using axios to make our api requests
  console.log(email);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/aj/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === 'success') {
      alert('Login successful');
      window.setTimeout(() => {
        location.assign('/signup');
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signIn(email, password);
});
