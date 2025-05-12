import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirName}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    message: 'sucess',
    data: {
      tours: tours,
    },
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is running on port, ${PORT}`);
});
