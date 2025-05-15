import { configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../src/models/tourModel.js';

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
  fs.readFileSync(`${_dirname}/../dev-data/data/tours-simple.json`),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours imported successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted successfully');
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
