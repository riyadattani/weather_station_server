// eslint-disable-next-line no-unused-vars
const should = require('should');
// const sinon = require('sinon');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const agent = request.agent(app);

const WeatherRecord = require('../models/weatherDataModel');

describe('Testing "/" Route', () => {
  it('response status should be 200', (done) => {
    agent.get('/')
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });

  after((done) => {
    app.server.close(done());
  });
});

describe('Testing the api POST route', function() {
  describe('If the data in the request is valid', function() {
    it('the data is saved in the database', function(done) {
      agent.post('/api/data')
        .send({
          temperature: 32,
          humidity: 67,
          pressure: 100,
          date: 1560643200000, // = 2019/5/16
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const id = res.body.record._id;

          WeatherRecord.findById(id, (err2, weatherRecord) => {
            weatherRecord.temperature.should.equal(32);
            done();
          });
        });
    });

    it('the response contains a confirmation message', function(done) {
      agent.post('/api/data')
        .send({
          temperature: 20,
          humidity: 50,
          pressure: 1000,
          date: 1560643200000, // = 2019/5/16
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          // if (err) return done(err);
          res.status.should.equal(200);
          res.body.message.should.equal('Record saved');
          done();
        });
    });
  });

  describe('If the data in the request is not valid', function() {
    it("it isn't saved in the database", function(done) {
      agent.post('/api/data')
        .send({
          humidity: 67,
          pressure: 100,
          date: 1, // = 2019/5/16
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(() => {
          WeatherRecord.find({ date: 1 }, (err, weatherRecord) => {
            weatherRecord.should.be.empty();
            done();
          });
        });
    });

    it("the response includes an error message", function(done) {
      agent.post('/api/data')
        .send({
          humidity: 67,
          pressure: 100,
          date: 1, // = 2019/5/16
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          // if (err) return done(err);
          res.status.should.equal(200);
          res.body.message.should.equal('Record was not saved');
          done();
        });
    });

    it("the response includes the Mongo error", function(done) {
      agent.post('/api/data')
        .send({
          temperature: 'a string',
          humidity: 'asdasd',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          // if (err) return done(err);
          res.body.mongoResponse.errors.temperature.message
            .should.equal('Cast to Number failed for value "a string" at path "temperature"');
          done();
        });
    });
  });

  afterEach((done) => {
    WeatherRecord.deleteMany({}).exec();
    done();
  });

  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
