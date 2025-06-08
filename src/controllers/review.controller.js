import Review from '../models/review.model.js';
import {
  createOne,
  deleteOne,
  getMany,
  getOne,
  updateOne,
} from './handler-factory.js';

export const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

export const getReviews = getMany(Review);

export const getReview = getOne(Review);

export const createReview = createOne(Review);

export const deleteReview = deleteOne(Review);

export const updateReview = updateOne(Review);
