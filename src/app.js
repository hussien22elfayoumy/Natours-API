import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import qs from 'qs';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { xss } from 'express-xss-sanitizer';
import mongoose from 'mongoose';
import url from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import tourRouter from './routes/tour.route.js';
import userRouter from './routes/user.route.js';
import reviewRouter from './routes/review.route.js';
import viewRouter from './routes/view.route.js';
import AppError from './utils/app-error.js';
import errorMiddleware from './middlewares/error.middleware.js';

const _fileName = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);

process.on('uncaughtException', (err) => {
  console.log('uncaught exception, Shutting down the system');
  console.log(err.name, err.message);

  // process.exit(0) => success || process.exit(1) => Failure / Error
  process.exit(1); // craching the app is a must
});

dotenv.config();
const app = express();

// setup the template engine
app.set('view engine', 'pug');
app.set('views', path.join(_dirname, 'views'));

// 1) Middlewares
// serving static files
app.use(express.static(path.join(_dirname, '..', 'public')));

// setting some sucurity headers
app.use(helmet());

app.set('query parser', (str) => qs.parse(str));

// logger function logs request informaiton
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes).
  message: 'Too many requests from this IP, please try again in one hour',
});
app.use('/api', limiter);

// Add the body property to the incoming reqest in express {body parser}
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization aganist noSQL query injection
// app.use(mongoSanitize()); doesn't work with the new version of express it mutate the query object

// Data sanitizatin against XSS attacks cross site scripting attacks
app.use(xss());

// Prevent paramaters pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://unpkg.com/leaflet@1.9.4/dist/leaflet.css https://unpkg.com/leaflet@1.9.4/dist/leaflet.js https://unpkg.com/axios/dist/axios.min.js;",
  );

  next();
});

// 2) Routes
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// handle unhandled routes
app.use((req, res, next) => {
  const err = new AppError(`Can't get the route ${req.originalUrl}`, 404);

  next(err); // will pass it to next middleware in middleware stack
});

// global error middleware
app.use(errorMiddleware);

// 3) connect to the database
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connectd to mongodb'));

// 4) Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejections, Shutting down the system');
  console.log(err.name, err.message);

  // process.exit(0) => success || process.exit(1) => Failure / Error
  server.close(() => process.exit(1)); // craching the app it optional
});
