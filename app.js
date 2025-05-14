import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();
const app = express();

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
