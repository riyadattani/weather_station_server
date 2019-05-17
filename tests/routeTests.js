const should = require('should');
const sinon = require('sinon');
const app = require('../app.js');
const request = require('supertest');

const agent = request.agent(app);

describe('Testing "/" Route', () => {
  it('response status should be 200', (done) => {
    agent.get('/')
      .end((err, results) => {
        results.status.should.equal(200)
        done();
      });
  });

  after((done) => {
    app.server.close(done());
  });
})
