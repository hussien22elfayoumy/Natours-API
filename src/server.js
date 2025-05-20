import mongoose from 'mongoose';
import app from './app.js';

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connectd to mongodb'));
// .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejections, Shutting down the system');
  console.log(err.name, err.message);

  // process.exit(0) => success || process.exit(1) => Failure / Error
  server.close(() => process.exit(1)); // craching the app it optional
});
