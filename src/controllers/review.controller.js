import Review from '../models/review.model.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const getReviews = catchErrorAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'sucess',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchErrorAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      review: newReview,
    },
  });
});
