import express from 'express';
import {
  getOverviewView,
  getTourView,
} from '../controllers/view.controller.js';

const router = express.Router();

router.get('/', getOverviewView);

router.get('/tours/:slug', getTourView);

export default router;
