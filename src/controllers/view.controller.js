import Tour from '../models/tour.model.js';
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

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
