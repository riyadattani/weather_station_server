const mongoose = require('mongoose');

const { Schema } = mongoose;

const weatherDataModel = new Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
);

module.exports = mongoose.model('WeatherData', weatherDataModel);
