import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import qs from 'qs';
import tourRouter from './routes/tour.route.js';
import userRouter from './routes/user.route.js';

dotenv.config();
const app = express();

// 1) Middlewares
app.set('query parser', (str) => qs.parse(str));

if (process.env.NODE_ENV === 'development') {
  // TIP logger function logs request informaiton
  app.use(morgan('dev'));
}

app.use(express.json()); // TIP: Add the body property to the incoming reqest in express

// 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle unhandled routes

app.all('/{*any}', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't get the route ${req.originalUrl}`,
  });

  next();
});

// 3) Start the server
export default app;
