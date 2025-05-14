import mongoose from 'mongoose';
import app from './app.js';

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connectd to mongodb'))
  .catch((err) => console.log(err));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'hello again',
  rating: 4.5,
  price: 444,
});

testTour.save();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
