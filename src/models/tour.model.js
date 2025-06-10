import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must be at most 40 characters'],
      minlength: [10, 'A tour name must be at least 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy or medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 1.0'],
      max: [5, 'A rating must be below 5.0'],
      set: (value) => Math.round(value * 10) / 10,
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
      validate: {
        validator: function (val) {
          // this function only work  when we create new documents will not work on update
          return val < this.price; // false will trigger validation error
        },
        message: 'Discount ({VALUE}) must be less or equal than price',
      },
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
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // [lng, lat]
      address: String,
      description: String,
    },
    locations: [
      // empeded document
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number], // [lng, lat]
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Apply indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// NOTE: we can't use virtulas in query we cant say tours.find({durationInWeeks: 2})
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate reviews for each tour
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT Middleware: runs before .save() && .create() command;
// NOTE: .insertMany() will not trigger save middleware
// this calles [a pre 'save' hook]
// this === document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});
/*
// Will be excuted after all pre middleware done
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
}); */

// QUERY Middleware
// this === query
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // will target all queryfn that start with find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// populate the guied before returing the res
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`This query took ${Date.now() - this.start}ms`);
  next();
});

// Aggregation Middleware
// this === current aggregation object
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
