/*
  name: dataconverter.js 
  modified last by: guru
  date last modified: 5 may 2018

*/

// Note: Some conversions require ogr2ogr
// brew install gdal

var utils = require('../utils/utils');
var geojson2 = require("geojson2");
var path = require('path');
var fs = require('fs');

// Assume inFormat and outFormat are in the form .EXTENSION
function convertTo(filePath, inFormat, outFormat) {
  const dirname = path.dirname(filePath) + '/';
  const newFileName = path.basename(filePath, inFormat) + outFormat;

  if (fs.stat(filePath), (err, stats) => {
  	if (err) {
  		throw err;
  	} 

  	if (!stats.isFile()) {
  		throw new Error('Requested file path does not point to a file');
  	}
  })

  if (inFormat.charAt(0) !== '.') {
  	inFormat = '.' + inFormat;
  } 

  if (outFormat.charAt(0) !== '.') {
  	outFormat = '.' + outFormat;
  } 

  utils.logExceptOnTest('converting ' + filePath + ' to ' + dirname + newFileName);

  if (inFormat !== outFormat) {

	  switch(outFormat) {
	  	case '.csv':
	  		return new Promise((resolve, reject) => {
                geojson2.csv(filePath, dirname + newFileName, (err) => {
    	  			if (!err) {
                        resolve();
                    } else {
                        reject(new Error('convertTo ERROR : ' + err));
                    }
    	  		});
            });
	  		break;
	  	// Shp files have multiple files. 
	  	// The third parameter says whether or not to zip them together.
	  	case '.shp':
            return new Promise((resolve, reject) => {
                geojson2.shp(filePath, dirname + newFileName, false, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject(new Error('convertTo ERROR : ' + err));
                    }
                });
            });
	  		break;
	  	case '.kml':
            return new Promise((resolve, reject) => {
                geojson2.kml(filePath, dirname + newFileName, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject(new Error('convertTo ERROR : ' + err));
                    }
                });
            });
	  		break;
	  	case '.topojson':
            return new Promise((resolve, reject) => {
                geojson2.topojson(filePath, dirname + newFileName, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject(new Error('convertTo ERROR : ' + err));
                    }
                });
            });
	  		break;
	  	default:
	  		throw new Error('Invalid Argument: ' + outFormat + ' is not a ' +
	  			'supported output file format');
	  }
  }

  utils.logExceptOnTest('convertTo: should only get here if inFormat !== outFormat');
}

module.exports.convertTo = convertTo
