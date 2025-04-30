import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from server side' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
