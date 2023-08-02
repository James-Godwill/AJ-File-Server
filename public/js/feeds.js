console.log('Inside javascript eefaffe');

const searchBtn = document.querySelector('.btnSearch');

searchBtn.addEventListener('click', () => {
  const searchText = document.querySelector('.find').value;

  console.log(searchText);

  location.assign(`/feeds/${searchText}`);
});
