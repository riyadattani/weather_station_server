const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from PlaceHolder. Deployed to Heroku from Travis. After a pull request.');
});

app.post('/api/data', (req, res) => {
  data = req.body;
  res.send(data);
});




app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;
