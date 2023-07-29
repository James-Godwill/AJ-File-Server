//rendering pug template

exports.signup = (req, res) => {
  res.status(200).render('signup');
};

exports.base = (req, res) => {
  res.status(200).render('base');
};
