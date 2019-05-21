# Weather station server app

[Weather Station API](<https://quiet-everglades-27917.herokuapp.com/>)

[![Maintainability](https://api.codeclimate.com/v1/badges/7731de9002d267973f9e/maintainability)](https://codeclimate.com/github/riyadattani/weather_station_server/maintainability)

A simple Node.js/Express app receiving data from a Raspberry Pi weather station and making it available via API to a separate dashboard app.

Tests:

Testing Root route '/':

- response status should be 200

Testing the api route:

- returns a confirmation message
- returns a helpful message if it couldn't save
- response include the Mongo error if it couldn't save
- saves the data in the database for a legit input
- returns an error message if it doesn't validate
- doesn't save the data in the database if it doesn't validate

Connect to mongo production database:
```script
mongo "mongodb+srv://weather-station-server-zrxmz.mongodb.net/test" --username weather-station-master
```

Ask Paul for the password!
