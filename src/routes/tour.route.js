import express from 'express';

import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  updateTour,
} from '../controllers/tour.controller.js';
import { authorize, protectRoute } from '../controllers/auth.controller.js';
import { createReview } from '../controllers/review.controller.js';

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protectRoute, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, authorize('admin', 'lead-guide'), deleteTour);

router
  .route('/:tourId/reviews')
  .post(protectRoute, authorize('user'), createReview);

export default router;
