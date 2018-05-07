/*
  name: filewriter.js
  modified last by: jerry
  date last modified: 5 may 2018
*/

//var fs = require('fs');
var fs = require('fs-extra');
var del = require('del');
var cpFile = require('cp-file');
var utils = require('../utils/utils');

function mkdirForRequest(path) { 
  fs.mkdirSync(path);
  utils.logExceptOnTest('made directory : ' + path);
}

function removeGJSON(path) {
  return del([path + '*.geojson']);
}

/*async function copyLinkedMultimedia2(mediaData, folderDir) {
  // copies multimedia data from its source directory (note that 
  // when this method is called, the multimedia links still have their
  // absolute path), to the temp directory for packaging later
  try {
    for (var i = 0; i < mediaData.length; i++) {
      var filename = mediaData[i].link.substring(
        mediaData[i].link.lastIndexOf('/') + 1
      );

      //if (!fs.existsSync(folderDir + filename)) {
      await fs.copy(mediaData[i].link, folderDir + filename);
      utils.logExceptOnTest("copied " + mediaData[i].link);
      //}
    }
  } catch (err) {
    console.error(err);
  }
} */

function copyLinkedMultimedia(mediaData, folderDir) {
  // copies multimedia data from its source directory (note that 
  // when this method is called, the multimedia links still have their
  // absolute path), to the temp directory for packaging later
  var pList = []; 
  for (var i = 0; i < mediaData.length; i++) {
    var filename = mediaData[i].link.substring(
      mediaData[i].link.lastIndexOf('/') + 1
    );

    pList.push(cpFile(mediaData[i].link, folderDir + filename)); 
  }

  Promise.all(pList).then(() => {
    utils.logExceptOnTest("copied files");
    return pList; 
  });

}

function generateFileName() {
  /* generates a random file name based on the date and a random number */
  var d = new Date();
  var fileName =
    ('0' + d.getFullYear()).slice(-2) +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    d.getDate() +
    ('0' + d.getHours()).slice(-2) +
    ('0' + d.getMinutes()).slice(-2) +
    ('0' + d.getSeconds()).slice(-2) +
    Math.floor(Math.random() * 1000000000);

  return fileName;
}

/*function writeToFile(data, path, fileName) {
  /* writes a file to a given path 
  return new Promise((resolve, reject) => {
    fs.writeFile(path + fileName + '.geojson', JSON.stringify(data), (err) => {
        if (!err) {
            console.log('wrote to: ' + path + fileName + '.geojson');
            resolve();
        } else {
            reject(new Error('writeToFile ERROR : ' + err));
        }
    });
  });
}*/

function writeToFile(data, path, fileName) {
  /* writes a file to a given path */
  fs.writeFileSync(path + fileName + '.geojson', JSON.stringify(data));
  
  utils.logExceptOnTest('wrote to: ' + path + fileName + '.geojson');
}

module.exports.writeToFile = writeToFile;
//module.exports.writeToFileSync = writeToFileSync;
module.exports.generateFileName = generateFileName;
module.exports.mkdirForRequest = mkdirForRequest;
module.exports.removeGJSON = removeGJSON;
module.exports.copyLinkedMultimedia = copyLinkedMultimedia;
