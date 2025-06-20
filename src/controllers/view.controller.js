import Booking from '../models/booking.model.js';
import Tour from '../models/tour.model.js';
import AppError from '../utils/app-error.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const getOverviewView = catchErrorAsync(async (req, res) => {
  // 1) get the tour data fro the collection
  const tours = await Tour.find();
  // 2) build the template

  // 3) render the the view

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTourView = catchErrorAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour)
    return next(new AppError('Ther is no such a tour with that name', 404));

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

export const getLoginFormView = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

export const getUserView = (req, res) => {
  res.status(200).render('account', {
    title: 'Account',
  });
};

export const getUserToursView = catchErrorAsync(async (req, res, next) => {
  // 1) find all bookings
  const bookings = await Booking.find({ user: req.user._id });

  // 2) find all tours for those	 bookings
  const tourIds = bookings.map((booking) => booking.tour);
  console.log(tourIds);

  const tours = await Tour.find({ _id: { $in: tourIds } });
  console.log(tours);

  res.status(200).render('overview', {
    title: 'User Tours',
    tours,
  });
});
