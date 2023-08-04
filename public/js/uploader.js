const uploadFile = async (formData) => {
  try {
    const resNew = await axios.post(
      'http://127.0.0.1:3000/aj/api/v1/files/createFile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (resNew.data.status === 'success') {
      alert('File Upload Successful');
    }
  } catch (err) {
    alert(err.response.data.message);

    // console.log(err);
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
