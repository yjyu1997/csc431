/*
  name: server-test.js
  modified last by: guru
  date last modified: 5 may 2018

  basic test to verify server is working
*/

process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app')

describe('loading express server', function () {
  var server;
  var request;

  beforeEach(function (done) {
    server = app.listen(done)
    request = supertest.agent(server)
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('responds to /', function testSlash(done) {
    request
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('404 invalid url', function testPath(done) {
    request
      .get('/foo/bar')
      .expect(404, done);
  });
});
