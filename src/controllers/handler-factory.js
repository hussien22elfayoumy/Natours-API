import AppError from '../utils/app-error.js';
import catchErrorAsync from '../utils/catch-err-async.js';

export const deleteOne = (Model) =>
  catchErrorAsync(async (req, res, next) => {
    const deletedTour = await Model.findByIdAndDelete(req.params.id);

    if (!deletedTour)
      return next(new AppError('No document found with that id', 404));

    res.status(204).json({
      status: 'success',
      message: null,
    });
  });

export const updateone = '';
