console.log('Inside javascript eefaffe');

const searchBtn = document.querySelector('.btnSearch');
const emailBtn = document.querySelector('.btn');

searchBtn.addEventListener('click', () => {
  const searchText = document.querySelector('.find').value;

  console.log(searchText);

  location.assign(`/feeds/${searchText}`);
});
