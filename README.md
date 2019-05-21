# Weather station server app

[Weather Station API](<https://quiet-everglades-27917.herokuapp.com/>)

[![Maintainability](https://api.codeclimate.com/v1/badges/7731de9002d267973f9e/maintainability)](https://codeclimate.com/github/riyadattani/weather_station_server/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/7731de9002d267973f9e/test_coverage)](https://codeclimate.com/github/riyadattani/weather_station_server/test_coverage)

[![Build Status](https://travis-ci.org/riyadattani/weather_station_server.svg?branch=master)](https://travis-ci.org/riyadattani/weather_station_server)

A simple Node.js/Express app receiving data from a Raspberry Pi weather station and making it available via API request from other sources. This app is part of our final project, a separate app was written to create a Single Page App that utilises the API server and displays the weather data.

[Go here to see the live SPA App](https://hybridbad.github.io/spa-weather-station-vanilla)

[Repo for SP App](https://github.com/hybridbad/spa-weather-station-vanilla)

### Technologies

- Javascript linted with eslint
- express
- mocha + nyc test Coverage
- mongodb with mongoose
- deployed to heroku via Travis CI/CD

### Instructions

Running:
```script
git clone https://github.com/riyadattani/weather_station_server.git
npm install
npm start

visit localhost:9000
```

Testing:
```script
npm test
```


### TDD Process

We employed a strict TDD process for the development of this app. We used the following test descriptions below:

#### Testing Root route '/':

- response status should be 200

#### Testing the POST route:

- returns a confirmation message
- returns a helpful message if it couldn't save
- response include the Mongo error if it couldn't save
- saves the data in the database for a legit input
- returns an error message if it doesn't validate
- doesn't save the data in the database if it doesn't validate

#### Testing the standard GET route:

- returns the posted data
- returns an empty response if the database is empty

#### Testing the GET route with a datetime filter

- if no initial datetime and no final datetime provided
    - Initial datetime defaults to 24 hours ago
    - Final datetime defaults to now
- if initial datetime and final datetime provided
    - Use provided initial datetime
    - Use provided final datetime
- if no initial datetime provided but final datetime provided
    - Initial datetime defaults to 24 hours before final datetime
    - Use provided final datetime
- if initial datetime provided but no final datetime provided
    - Use provided initial datetime
    - Final datetime defaults to now


### MongoDB
Connect to mongo production database:
```script
mongo "mongodb+srv://weather-station-server-zrxmz.mongodb.net/test" --username weather-station-master
```
Sozza you need a password ;-)
