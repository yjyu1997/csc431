/*
  name: dataconverter-test.js 
  modified last by: guru
  date last modified: 5 may 2018

  unit test for data converter
*/

process.env.NODE_ENV = 'test';

var chai = require('chai');
var del = require('del');
var dataconverter = require('../converter/dataconverter');

var expect = chai.expect;
var should = chai.should();

const testfiles = __dirname + '/testfiles/';

describe('data converter', function() {

  this.timeout(500);

  // remove converted files
  after(() => {
    del.sync(
      [
        testfiles + '*.csv', 
        testfiles + '*.dbf', 
        testfiles + '*.kml', 
        testfiles + '*.prj', 
        testfiles + '*.shp', 
        testfiles + '*.shx',
        testfiles + '*.topojson'
      ]);
  });

  it('should take a geojson file and output a csv file', function(done){
    setTimeout(done, 300);
    dataconverter.convertTo(testfiles + 'in.geojson', '.geojson', '.csv', function(err){
      if(err) throw err
      fs.exists(testfiles + 'in.csv', function(exists){
        exists.should.be.true;
        done()
      })
    })
  }); 

  it('should take a geojson file and output a shape file', function(done){
    setTimeout(done, 300);
    dataconverter.convertTo(testfiles + 'in.geojson', '.geojson', '.shp', function(err){
      if(err) throw err
      fs.exists(testfiles + 'in.shp', function(exists){
        exists.should.be.true;
        done()
      })
    })
  });

  it('should take a geojson file and output a kml file', function(done){
    setTimeout(done, 300);
    dataconverter.convertTo(testfiles + 'in.geojson', '.geojson', '.kml', function(err){
      if(err) throw err
      fs.exists(testfiles + 'in.kml', function(exists){
        exists.should.be.true;
        done()
      })
    })
  }); 

  it('should take a geojson file and output a topojson file', function(done){
    setTimeout(done, 300);
    dataconverter.convertTo(testfiles + 'in.geojson', '.geojson', '.topojson', function(err){
      if(err) throw err
      fs.exists(testfiles + 'in.topojson', function(exists){
        exists.should.be.true;
        done()
      })
    })
  }); 

  it('should take a geojson file and output a csv file even though the . is missing', function(done){
    setTimeout(done, 300);
    dataconverter.convertTo(testfiles + 'in.geojson', 'geojson', 'csv', function(err){
      if(err) throw err
      fs.exists(testfiles + 'in.csv', function(exists){
        exists.should.be.true;
        done()
      })
    })
  });
}) 