const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

if (process.env.ENV === 'Test') {
  mongoose.connect('mongodb://localhost/weather-data-test', { useNewUrlParser: true });
} else if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/weather-data-dev', { useNewUrlParser: true });
}

const WeatherRecord = require('./models/weatherDataModel', { useNewUrlParser: true });

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from [placeholder]');
});

app.all('/api/data', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/api/data', (req, res) => {
  WeatherRecord.find((err, weatherData) => {
    res.send(weatherData);
  });
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
  if (process.env.Env !== 'Test' && !process.env.MONGODB_URI) {
    console.log(`Running on port ${port}`);
  }
});

module.exports = app;
