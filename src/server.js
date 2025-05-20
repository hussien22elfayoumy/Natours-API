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
  console.log(err.name, err.message);
  console.log('unhandled rejections, Shutting down the system');

  // process.exit(0) => success || process.exit(1) => Failure / Error
  server.close(() => process.exit(1));
});
