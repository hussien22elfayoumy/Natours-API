import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

const tours = JSON.parse(
  fs.readFileSync(`${__dirName}/../dev-data/data/tours-simple.json`, 'utf-8')
);

export const getAllTours = (req, res) => {
  res.status(200).json({
    message: 'sucess',
    data: {
      tours: tours,
    },
  });
};

export const createTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
export const getTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
export const updateTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
export const deleteTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};
