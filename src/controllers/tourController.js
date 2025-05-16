import Tour from '../models/tourModel.js';

export const getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // Build the query
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    /* 
		mongodb filtring
		Tour.find({difficulty: 'easy', duration: {$gte: 5}})
		the queryObj
		Tour.find({difficulty: 'easy', duration: {gte: 5}})
		so we gonna solve this problem
		*/

    // 1B) Adbanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.replaceAll(',', ' ');
      query = query.sort(sortBy);

      // if you want decending use (-) before the field
      // to sort with multi falue in mongo  sort('price duration') in url sort=price,duration
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting

    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(',', ' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Limiting the results and pagination
    // page=2&limit=10 => 1-10 page 1, 11-20 page2, 21-30 paage 3, ...
    // mongo skip(10).limit(10) this mean page no 2

    const pageNo = +req.query.page || 1;
    const limitNo = +req.query.limit || 100;

    const skip = (pageNo - 1) * limitNo;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) throw new Error("This page doesn't Exist");
    }

    query = query.skip(skip).limit(limitNo);

    // Execute the query
    const tours = await query;
    /*    const tours = await Tour.find()
      .where('duration')
      .equals('5')
      .where('difficulty')
      .equals('easy'); */

    res.status(200).json({
      message: 'sucess',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      message: 'sucess',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defiend',
  });
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
