import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import qs from 'qs';
import tourRouter from './routes/tour.route.js';
import userRouter from './routes/user.route.js';

dotenv.config();
const app = express();
app.set('query parser', (str) => qs.parse(str));

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// TIP logger function logs request informaiton

app.use(express.json()); // TIP: Add the body property to the incoming reqest in express

// 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3) Start the server
export default app;
