/*
  name: download-test.js 
  modified last by: guru
  date last modified: 6 may 2018

  end to end download integration test
  also a proof-of-work of the datapackager since a zip file results
*/

process.env.NODE_ENV = 'test';

const async= require('async');
const sinon = require('sinon');
const request = require('request');
const chai = require('chai');

const should = chai.should();

const base = 'http://localhost:3000';

const url = `${base}/download`;

const options = {
    method: 'post',
    body: { 
      construccion: '1', 
      workshop_20170210: '2', 
      terreno: '3', 
      formattype: 'kml' 
    },
    json: true,
    url: url,
    headers: {
        'Host': 'localhost'
    }
  };  

function httpPost(url, callback) {
  request(options,
    function(err, res, body) {
      if (err) console.log(err);
      res.statusCode.should.equal(200);
      res.headers['content-type'].should.contain('application/zip');
      callback(err, body);
    }
  );
}

describe('end to end download test', function () {
  
  it('should take in table parameters and output a zip file', (done) => {
    request(options, (err, res, body) => {
      res.statusCode.should.equal(200);
      res.headers['content-type'].should.contain('application/zip');
      done();
    });
  });
  
  it('should take in 3 simultaneous requests', (done) => {
    let urls = [];

    for (let i = 0; i < 3; i++) {
      urls.push(url);
    }

    async.map(urls, httpPost, function (err, res){
      if (err) return console.log(err);
      done();
    });
  });

  it('should take in 10 simultaneous requests', function(done) {
    this.timeout(5000);
    let urls = [];

    for (let i = 0; i < 10; i++) {
      urls.push(url);
    }

    async.map(urls, httpPost, function (err, res){
      if (err) return console.log(err);
      done();
    });
  });

  it('should take in 100 simultaneous requests', function(done) {
    this.timeout(40000);
    let urls = [];

    for (let i = 0; i < 100; i++) {
      urls.push(url);
    }

    async.map(urls, httpPost, function (err, res){
      if (err) return console.log(err);
      done();
    });
  });

  /* we got a little ambitious... 😉

    it('should take in 300 simultaneous requests', function(done) {
    this.timeout(30000);
    let urls = [];

    for (let i = 0; i < 300; i++) {
      urls.push(url);
    }

    async.map(urls, httpPost, function (err, res){
      if (err) return console.log(err);
      done();
    });
  }); */
});
