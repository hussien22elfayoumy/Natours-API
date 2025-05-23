import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import qs from 'qs';
import { rateLimit } from 'express-rate-limit';
import tourRouter from './routes/tour.route.js';
import userRouter from './routes/user.route.js';
import AppError from './utils/app-error.js';
import errorMiddleware from './middlewares/error.middleware.js';

process.on('uncaughtException', (err) => {
  console.log('uncaught exception, Shutting down the system');
  console.log(err.name, err.message);

  // process.exit(0) => success || process.exit(1) => Failure / Error
  process.exit(1); // craching the app is a must
});

dotenv.config();
const app = express();

// 1) Middlewares
app.set('query parser', (str) => qs.parse(str));

if (process.env.NODE_ENV === 'development') {
  // TIP logger function logs request informaiton
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes).
  message: 'Too many requests from this IP, please try again in one hour',
});

app.use('/api', limiter);

app.use(express.json()); // TIP: Add the body property to the incoming reqest in express

// 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle unhandled routes

app.use((req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can't get the route ${req.originalUrl}`,
  }); */

  // const err = new Error(`Can't get the route ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new AppError(`Can't get the route ${req.originalUrl}`, 404);

  next(err); // will pass it to next middleware in middleware stack
});

// global error middleware
app.use(errorMiddleware);

// 3) Start the server
export default app;
