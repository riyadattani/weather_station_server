const mongoose = require('mongoose');

const { Schema } = mongoose;

const weatherDataModel = new Schema(
  {
    temperature: { type: Number },
    humidity: { type: Number },
    pressure: { type: Number },
    date: { type: Date },
  },
);

module.exports = mongoose.model('WeatherData', weatherDataModel);
