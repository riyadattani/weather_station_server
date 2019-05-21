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
  const dateNow = (new Date()).toISOString();

  res.send('Hello from [placeholder]\n' + `<a href="https://quiet-everglades-27917.herokuapp.com/api/data?final_datetime=${dateNow}">Test the api</a>`);
  // res.send('https://quiet-everglades-27917.herokuapp.com/api/data');
});

app.all('/api/data', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/api/data', (req, res) => {
  const { query } = req;
  query.final_datetime = query.final_datetime
                         || new Date(new Date().getTime());
  query.initial_datetime = query.initial_datetime
                           || new Date(new Date(query.final_datetime) - 86400000); // 24 hours ago

  WeatherRecord.find()
    .where('date').gt(query.initial_datetime)
    .where('date').lt(query.final_datetime)
    .exec((err, weatherData) => {
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
