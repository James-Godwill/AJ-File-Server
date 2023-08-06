const AppError = require('../utils/appError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stact: err.stack,
    });
  } else {
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    res.status.json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
