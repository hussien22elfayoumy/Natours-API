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

// 2) Routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 3) Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
