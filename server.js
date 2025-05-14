import mongoose from 'mongoose';
import app from './app.js';

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connectd to mongodb'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
