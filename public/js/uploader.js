console.log('Inside javascript');
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
// const uploadFile = async (email, password) => {
//   //Using axios to make our api requests
//   console.log(email);
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:3000/aj/api/v1/users/login',
//       data: {
//         email: email,
//         password: password,
//       },
//     });

//     if (res.data.status === 'success') {
//       alert('Login successful');
//       window.setTimeout(() => {
//         location.assign('/feeds/default');
//       }, 1500);
//     }

//     console.log(res);
//   } catch (err) {
//     alert(err.response.data.message);
//   }
// };

const uploadFile = async (formData) => {
  try {
    const resNew = axios.post(
      'http://127.0.0.1:3000/aj/api/v1/files/createFile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(resNew.response.data);
  } catch (err) {
    console.log(err.response);
  }
};

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData();
  const imagefile = document.querySelector('#myfile');
  const title = document.querySelector('#title').value;
  const description = document.querySelector('#description').value;
  formData.append('title', title);
  formData.append('description', 'This is my new book');
  formData.append('file', imagefile.files[0]);

  console.log(imagefile.files[0]);

  //   const formData = new FormData();
  //   formData.append('file', myFile);

  //   axios.post('/bezkoder.com/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  uploadFile(formData);

  //   console.log('iNSIDE')

  //   const email = document.getElementById('email').value;
  //   const password = document.getElementById('password').value;
});
