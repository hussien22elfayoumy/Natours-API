import express from 'express';

import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  updateTour,
} from '../controllers/tour.controller.js';
import { authorize, protectRoute } from '../controllers/auth.controller.js';
import reviewRouter from './review.route.js';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protectRoute, authorize('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protectRoute, authorize('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protectRoute, authorize('admin', 'lead-guide'), updateTour)
  .delete(protectRoute, authorize('admin', 'lead-guide'), deleteTour);

export default router;
