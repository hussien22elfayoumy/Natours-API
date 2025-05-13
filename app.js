import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

const app = express();

// 1) Middlewares
app.use(morgan('dev')); // TIP logger function logs request informaiton

app.use(express.json()); // TIP: Add the body property to the incoming reqest in express

const tours = JSON.parse(
  fs.readFileSync(`${__dirName}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    message: 'sucess',
    data: {
      tours: tours,
    },
  });
};

const createTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const getTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const updateTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const deleteTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};

// 2) Routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 3) Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
