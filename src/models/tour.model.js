import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a diffculty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// NOTE: we can't use virtulas in query we cant say tours.find({durationInWeeks: 2})
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT Middleware: runs before .save() && .create() command;
// NOTE: .insertMany() will not trigger save middleware
// this calles [a pre 'save' hook]
/* tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Will be excuted after all pre middleware done
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
}); */

// QUERY Middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // will target all queryfn that start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`This query took ${Date.now() - this.start}ms`);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
