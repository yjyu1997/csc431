/*
  name: filewriter-test.js 
  modified last by: guru
  date last modified: 5 may 2018

  unit test for the file writer
*/

process.env.NODE_ENV = 'test';

var filewriter = require('../io/filewriter');
var chai = require('chai');
var del = require('del');
var fs = require('fs-extra');

var expect = chai.expect;
var should = chai.should();

const testfiles = __dirname + '/testfiles/';

const fakeData = {
  "type": "FeatureCollection",
  "features": []
};

describe('filewriter test', () => {
   
   after(() => {
      del.sync([testfiles + 'test.geojson']);
   });
    
   it('should take in data and output a geojson file with the data', (done) => {
      filewriter.writeToFile(fakeData, testfiles, 'test');
      expect(fs.existsSync(testfiles + 'test.geojson')).to.be.true;
      expect(fs.readFileSync(testfiles + 'test.geojson').toString())
        .to.equal(JSON.stringify(fakeData))
      done();
  })  
});
