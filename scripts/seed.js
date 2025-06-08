/* eslint-disable no-console */
import { configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../src/models/tour.model.js';
import Review from '../src/models/review.model.js';
import User from '../src/models/user.model.js';

const _fileName = fileURLToPath(import.meta.url);
const _dirname = dirname(_fileName);

configDotenv({
  path: `${_dirname}/../.env`,
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connectd to mongodb'))
  .catch((err) => console.log(err));

const tours = JSON.parse(
  fs.readFileSync(`${_dirname}/../dev-data/data/tours.json`),
);
const reviews = JSON.parse(
  fs.readFileSync(`${_dirname}/../dev-data/data/reviews.json`),
);
const users = JSON.parse(
  fs.readFileSync(`${_dirname}/../dev-data/data/users.json`),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours imported successfully');

    // NOTE: Stop password encryption also
    await User.create(users, { validateBeforeSave: false });
    console.log('Users imported successfully');

    await Review.create(reviews);
    console.log('Reviews imported successfully');

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted successfully');
    await User.deleteMany();
    console.log('Users deleted successfully');
    await Review.deleteMany();
    console.log('Reviews deleted successfully');

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
