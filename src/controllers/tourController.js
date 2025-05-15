import Tour from '../models/tourModel.js';

export const getAllTours = (req, res) => {
  res.status(200).json({
    message: 'sucess',
    data: {
      // tours: tours,
    },
  });
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
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
