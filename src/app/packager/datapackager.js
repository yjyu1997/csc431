/*
  name: datapackager.js 
  modified last by: guru
  date last modified: 5 may 2018
*/

var utils = require('../utils/utils');
var path = require('path');
var fs = require('fs');
var archiver = require ('archiver');

// sends a zip file to the client with the contents
// from the directoryToPackage
function package(directoryToPackage, outFileName, res) {

    // commented out in case it's needed in the future
    // var raN = randomNames();

    // create archiver object
    var archive = archiver('zip', {
        //talk with jerry about the level of compression level
        zlib: { level: 9 } // Sets the compression level.
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        res.status(500).send({error: err.message});
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    archive.on('end', function() {
        utils.logExceptOnTest('Archive wrote ' + archive.pointer() + ' bytes');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
            utils.logExceptOnTest(err)
        } else {
            // throw error
            throw err;
        }
    });

    if (outFileName.indexOf('zip') <= -1) {
        outFileName = outFileName + '.zip';
    }

    // send zip file as an attachment to the client
    res.attachment(outFileName);

    // pipe archive data to the response's attachment
    archive.pipe(res);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(directoryToPackage, false);
    archive.finalize();
}

/*function randomNames() {
    return md5(" " + Math.random()*100000);
}*/

module.exports.package = package;
