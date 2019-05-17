const should = require('should');
const sinon = require('sinon');
const request = require('supertest');
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
  it('responds with a JASON X', (done) => {
    request(app).post('/api/data')
      .send({ data: { temperature: 9000 } })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      // eslint-disable-next-line consistent-return
      .end((err, res) => {
        if (err) return done(err);
        res.status.should.equal(200);
        done();
      });
  });

  after((done) => {
    app.server.close(done());
  });
});
