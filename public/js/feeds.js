const searchBtn = document.querySelector('.btnSearch');
const signoutBtn = document.querySelector('.logout');
const emailBtn = document.querySelector('.btn');

searchBtn.addEventListener('click', () => {
  let searchText = document.querySelector('.find').value;

  if (!searchText) {
    searchText = 'null';
  }
  location.assign(`/feeds/${searchText}`);

  console.log(searchText);
});

const signOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/aj/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      location.assign('/');
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};
signoutBtn.addEventListener('click', () => {
  signOut();
});
