import AppError from '../utils/app-error.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const deleteOne = (Model) =>
  catchErrorAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that id', 404));

    res.status(204).json({
      status: 'success',
      message: null,
    });
  });

export const updateOne = (Model) =>
  catchErrorAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc)
      return next(new AppError('No document found with that id', 404));

    res.status(201).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

export const createOne = (Model) =>
  catchErrorAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        data: newDoc,
      },
    });
  });

export const getOne = (Model, populateOptions) =>
  catchErrorAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No document found with that id', 404));

    res.status(200).json({
      message: 'sucess',
      data: {
        data: doc,
      },
    });
  });
