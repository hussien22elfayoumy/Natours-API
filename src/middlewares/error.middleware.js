import AppError from '../utils/app-error.js';

const sendErrorDev = (err, req, res) => {
  // A) API
  // originalUrl => without the host name
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let myErr = Object.create(err);

    if (err.name === 'CastError') {
      // id error Cast to ObjectId failed
      const message = `Ivalid ${err.path}: ${err.value}.`;
      myErr = new AppError(message, 400);
    }
    if (err.code === 11000) {
      // duplicate key error collection
      const message = `Duplicate filed value: ${err.keyValue.name}, please user another value`;

      myErr = new AppError(message, 400);
    }
    if (err.name === 'ValidationError') {
      myErr = new AppError(err.message, 400);
    }

    if (err.name === 'JsonWebTokenError')
      myErr = new AppError('Invalid token. Please login again', 401);

    if (err.name === 'TokenExpiredError')
      myErr = new AppError('Your Token has expired. Please login again', 401);

    sendErrorProd(myErr, req, res);
  }

  next();
};
