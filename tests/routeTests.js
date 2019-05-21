// eslint-disable-next-line no-unused-vars
const should = require('should');
const sinon = require('sinon');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const agent = request.agent(app);

const WeatherRecord = require('../models/weatherDataModel');

describe('Testing the api route', () => {
  describe('Homepage tests', () => {
    it('"/" route exists', (done) => {
      agent.get('/')
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });
  });

  describe('POST route tests', () => {
    it('returns a confirmation message', (done) => {
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

    it("returns a helpful message if it couldn't save", (done) => {
      agent.post('/api/data')
        .send({
          temperature: 'a string',
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

    it("response include the Mongo error if it couldn't save", (done) => {
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

    it('saves the data in the database for a legit input', (done) => {
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
          // eslint-disable-next-line no-underscore-dangle
          const id = res.body.record._id;

          WeatherRecord.findById(id, (err2, weatherRecord) => {
            weatherRecord.temperature.should.equal(32);
            done();
          });
        });
    });

    it("returns an error message if it doesn't validate", (done) => {
      agent.post('/api/data')
        .send({ })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.message.should.equal('Record was not saved');
          done();
        });
    });

    it("doesn't save the data in the database if it doesn't validate", (done) => {
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
  });

  describe('GET route tests', () => {
    it('returns the posted data', (done) => {
      const getWeatherRecord = new WeatherRecord({
        temperature: 32,
        humidity: 67,
        pressure: 100,
        date: 1560643200000, // = 2019/5/16
      });

      getWeatherRecord.save(() => {
        agent.get('/api/data')
          .end((err, res) => {
            res.status.should.equal(200);
            done();
          });
      });
    });

    it('returns an empty response if database is empty', (done) => {
      agent.get('/api/data')
        .end((err, res) => {
          res.body.should.be.empty();
          done();
        });
    });

    describe('Filtering by date', function () {
      this.clock = sinon.useFakeTimers(new Date('2019-05-19T14:30:00.000Z'));

      describe('No initial datetime and no final datetime provided', () => {
        it('Initial datetime defaults to 24 hours ago', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:29:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:31:00.000Z',
            },
          ], () => {
            agent.get('/api/data')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
        it('Final datetime defaults to now', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-19T14:29:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-19T14:31:00.000Z',
            },
          ], () => {
            agent.get('/api/data')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
      });

      describe('Initial datetime and final datetime provided', () => {
        it('Use provided initial datetime', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?initial_datetime=2019-05-17T14:30:00.000Z&final_datetime=2019-05-18T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
        it('Use provided final datetime', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?initial_datetime=2019-05-17T14:30:00.000Z&final_datetime=2019-05-18T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
      });

      describe('No initial datetime provided but final datetime provided', () => {
        it('Initial datetime defaults to 24 hours before final datetime', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?final_datetime=2019-05-18T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
        it('Use provided final datetime', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-18T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?final_datetime=2019-05-18T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
      });

      describe('Initial datetime provided but no final datetime provided', () => {
        it('Use provided initial datetime', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-17T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?initial_datetime=2019-05-17T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
        it('Final datetime defaults to now', (done) => {
          WeatherRecord.create([
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-19T14:31:00.000Z',
            },
            {
              temperature: 32,
              humidity: 67,
              pressure: 100,
              date: '2019-05-19T14:29:00.000Z',
            },
          ], () => {
            agent.get('/api/data?initial_datetime=2019-05-17T14:30:00.000Z')
              .end((err, res) => {
                res.body.length.should.equal(1);
                done();
              });
          });
        });
      });

      after((done) => {
        this.clock.restore();
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
