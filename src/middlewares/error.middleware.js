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
  if (err.isOperationlError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error unknown errors avoid: don't leek to the client
  } else {
    // 1) log the error
    console.error('Error 💥', err);

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
    sendErrorProd(err, res);
  }

  next();
};
