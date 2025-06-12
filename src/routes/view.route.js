import express from 'express';
import {
  getLoginFormView,
  getOverviewView,
  getTourView,
} from '../controllers/view.controller.js';

const router = express.Router();

router.get('/', getOverviewView);

router.get('/tours/:slug', getTourView);

router.get('/login', getLoginFormView);

export default router;
