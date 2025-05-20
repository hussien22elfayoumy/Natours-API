import AppError from '../utils/app-error.js';

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  // Operational Erros and trusted: send to client
  if (err.isOperationalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error unknown errors avoid: don't leek to the client
  } else {
    // 1) log the error
    console.error('Erroree 💥', err);

    // 2) send to client
    res.status(500).json({
      status: 'error',
      message: 'Somethig went very wrong',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let myErr = Object.create(err);

    if (err.name === 'CastError') {
      // id error Cast to ObjectId failed
      const message = `Ivalid ${err.path}: ${err.value}.`;
      myErr = new AppError(message, 400);
    } else if (err.code === 11000) {
      // duplicate key error collection
      const message = `Duplicate filed value: ${err.keyValue.name}, please user another value`;

      myErr = new AppError(message, 400);
    } else if (err.name === 'ValidationError') {
      myErr = new AppError(err.message, 400);
    }
    sendErrorProd(myErr, res);
  }

  next();
};
