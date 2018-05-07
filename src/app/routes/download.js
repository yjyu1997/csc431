/*
  name: download.js
  modified last by: guru
  date last modified: 5 may 2018

  Functions as the download REST controller in SAS diagram
  This is our one (and only) route which exposes the endpoint for this server
*/

var express = require('express');
var fileWriter = require('../io/filewriter');
var dataConverter = require('../converter/dataconverter');
var dataManager = require('../db/datamanager');
var dataPackager = require('../packager/datapackager');
var utils = require('../utils/utils');
var bodyParser = require('body-parser');
var cleandir = require('clean-dir');

var router = express.Router();

var pathToTemp = __dirname + '/../temp/';

utils.logExceptOnTest(fileWriter);
utils.logExceptOnTest(dataManager);
utils.logExceptOnTest(dataConverter);
utils.logExceptOnTest(dataPackager);
utils.logExceptOnTest(utils);
// moves all temporary files created to the trash
cleandir(pathToTemp, function(err) {});

// package for retrieving data from fields as JSON, as we are to expect
// from the search team
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

router.post('/', (req, res) => {
  /* note that req.body receives the field data as JSON, e.g.:
       { construccion: '1 2 3', workshop_20170210: '5', terreno: '3',
      formattype: 'csv', ... }
    */

  // if ids are specified for the construccion table, in the example
  // above this would be '1 2 3'
  utils.logExceptOnTest(req.body);
  // list of promises containing each request to getData();
  // this holds the results from construccion, terreno, etc.
  var promiseList = [];
  // list of promises containing each call to convertTo
  // used to determine when converting is complete and
  // packaging can commence
  var conversionList = [];
  // a list of keys that runs parallel to the promise list
  // this holds the names like "construccion", "terreno", "workshop"
  var keyList = [];
  //output format for the data
  var outFormat = req.body.formattype.trim();

  var dirName = fileWriter.generateFileName();
  fileWriter.mkdirForRequest(pathToTemp + dirName);

  // get data for all the given references
  Object.keys(req.body).forEach(function(key) {
    utils.logExceptOnTest('key : ' + key + ', value: ' + req.body[key]);
    var refs = req.body[key].trim();
    promiseList.push(getData(refs, key, pathToTemp + dirName + '/'));
    keyList.push(key);
  });

  // Since this is the main body and not in an async function,
  // we need to do a .then() to wait for the data
  Promise.all(promiseList).then(function(valArray) {
    // try to retrieve data from all tables corresponding to the
    // given references
    var data = {
      status: 'success',
      inFormat: 'geojson' // input format of the data
    };
    // create a unique directory name for each request; this name will
    // also be used for the individual files
    data['dirName'] = dirName;
    var name = dirName + '/' + dirName;
    // valArray[0] is result of promise0
    // valArray[1] is result of promise1, etc.
    for (var i = 0; i < valArray.length; i++) {
      // if getData() did not return undefined, then we received
      // some data, e.g. the results from construccion table
      if (valArray[i] !== undefined) {
        data[keyList[i]] = valArray[i];
        var fileName = name + '-' + keyList[i];
        fileWriter.writeToFile(valArray[i], pathToTemp, fileName);
        // convert the data to the desired output format, only if
        // it is something other than geoJSON
        utils.logExceptOnTest('convert me to ' + outFormat);
        if (outFormat !== 'geojson') {
          conversionList.push(
            dataConverter.convertTo(
              pathToTemp + fileName + '.geojson',
              '.geojson',
              '.' + outFormat
            )
          );
        }
      }
    }

    // For demo purposes, pass the res obj for a direct download to the browser
    // If this was integrated, we'd return a file path on the file system instead
    Promise.all(conversionList).then(() => {
      utils.logExceptOnTest('conversions successful');
      if (outFormat !== 'geojson') {
        // if desired output format is not geojson, clear out the directory
        // of geoJSON files
        fileWriter
          .removeGJSON(pathToTemp + data['dirName'] + '/')
          .then(paths => {
            // removal is done asynchronously, probably best practice
            utils.logExceptOnTest('files deleted:\n' + paths.join('\n'));
            dataPackager.package(
              pathToTemp + data['dirName'],
              data['dirName'] + '.zip',
              res
            );
          });
      } else {
        // just package the geojson
        dataPackager.package(
          pathToTemp + data['dirName'],
          data['dirName'] + '.zip',
          res
        );
      }
    });

    // res.status(200).json(data);
  });
});

// Returns a data promise from db
async function getData(refs, tableName, folderName) {
  if (refs.trim().length > 0) {
    // converts the field input "1 2 3" into a comma-delimited string,
    // i.e., "1, 2, 3". input refs can be delimited by anything,
    // for instance either "1b2e3" or "1-2-3" works
    var refsAsList = refs
      .split(/\D/)
      .filter(val => val)
      .join(',');
    // now fetch data from database for these ids
    const qString = dataManager.generateQuery(refsAsList, tableName);
    if (qString !== undefined) {
      // first grab multimedia data, if any 
      const mediaQString = dataManager.generateMultimediaQuery(
        refsAsList,
        tableName
      );
      // Since this is called in an async function, data will be
      // properly populated when it is returned.
      var mediaData = await dataManager.fetchFromDbMultimedia(mediaQString);
      if (mediaData !== undefined) {
        // if there was media data, then copy it to the temp folder location
        // as tim says, multimedia is a "direct download"
        fileWriter.copyLinkedMultimedia(mediaData, folderName);
      }
      // next, fetch the geospatial data from the database; this requires 
      // further processing so we return this data; also note the await 
      var data = await dataManager.fetchFromDb(qString, mediaData);
      return data;
    }
  }

  return undefined;
}

module.exports = router;
