const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

if (process.env.ENV === 'Test') {
  mongoose.connect('mongodb://localhost/weather-data-test', { useNewUrlParser: true });
} else if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://localhost/weather-data-dev', { useNewUrlParser: true });
}

const WeatherRecord = require('./models/weatherDataModel');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from Placeholder');
});

app.post('/api/data', (req, res) => {
  const weatherRecord = new WeatherRecord(req.body);
  weatherRecord.save((err) => {
    if (err) {
      res.send({
        message: 'Record was not saved',
        mongoResponse: err,
      });
    } else {
      res.send({
        message: 'Record saved',
        record: weatherRecord,
      });
    }
  });
});


app.server = app.listen(port, () => {
  if (process.env.ENV !== 'Test' && !process.env.MONGODB_URI) {
    console.log(`Running on port ${port}`);
  }
});

module.exports = app;
