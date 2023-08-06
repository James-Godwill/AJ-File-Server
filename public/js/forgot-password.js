/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

const forgotPassword = async (emails) => {
  //Using axios to make our api requests
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/aj/api/v1/users/forgotpassword',
      data: {
        email: emails,
      },
    });

    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const emails = document.getElementById('email').value;

  forgotPassword(emails);
});
