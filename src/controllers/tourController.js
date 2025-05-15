import Tour from '../models/tourModel.js';

export const getAllTours = (req, res) => {
  res.status(200).json({
    message: 'sucess',
    data: {
      // tours: tours,
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
