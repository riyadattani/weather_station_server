const should = require('should');
// const sinon = require('sinon');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const agent = request.agent(app);

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

describe('Testing the api route', () => {
  it('returns a confirmation message', (done) => {
    agent.post('/api/data')
      .send({ temperature: 20 })
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
        humidity: 'another string',
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

  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
