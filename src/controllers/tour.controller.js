import Tour from '../models/tour.model.js';
import APIFeatures from '../utils/api-features.js';
import AppError from '../utils/app-error.js';
import catchErrorAsync from '../utils/catch-err-async.js';
import { createOne, deleteOne, updateOne } from './handler-factory.js';

export const aliasTopTours = (req, res, next) => {
  req.url =
    '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5';

  next();
};

export const getAllTours = catchErrorAsync(async (req, res, next) => {
  const toursFeaturesQuery = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await toursFeaturesQuery.mongoQuery;

  res.status(200).json({
    message: 'sucess',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

export const createTour = createOne(Tour);

export const getTour = catchErrorAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
  });

  if (!tour) return next(new AppError('No tour found with that id', 404));

  res.status(200).json({
    message: 'sucess',
    data: {
      tour: tour,
    },
  });
});

export const updateTour = updateOne(Tour);

export const deleteTour = deleteOne(Tour);

export const getTourStats = catchErrorAsync(async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null, this will give the all results and aggregate on it
        _id: { $toUpper: '$difficulty' }, // aggregate only in the group
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      tourStats,
    },
  });
});

// how many tours for each month in given year
export const getMonthlyPlan = catchErrorAsync(async (req, res, next) => {
  const year = +req.params.year;

  const monthlyPlan = await Tour.aggregate([
    { $unwind: '$startDates' }, // will return the tours for each date in startDates array
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      monthlyPlan,
    },
  });
});
