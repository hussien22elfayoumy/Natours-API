import Stripe from 'stripe';
import dotenv from 'dotenv';
import catchErrorAsync from '../utils/catch-err-async.js';
import Tour from '../models/tour.model.js';
import Booking from '../models/booking.model.js';
import AppError from '../utils/app-error.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchErrorAsync(async (req, res, next) => {
  // 1) find the tour with that id

  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError('There is no tour with that id.', 404));

  // 2) create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
    mode: 'payment',
  });
  // 3) send it to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchErrorAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
