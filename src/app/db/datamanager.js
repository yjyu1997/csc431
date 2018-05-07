/*
  name: datamanager.js
  modified last by: guru
  date last modified: 5 may 2018
*/

const utils = require('../utils/utils');
const promise = require('bluebird');

const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(initOptions);

const connection = {
  user: 'Jerry', // put your username for the db here
  host: '127.0.0.1', // don't change
  database: 'lasflores', // don't change
  password: '', // possibly, you may have a password
  port: 5432 // don't change
};

const db = pgp(connection);

function fetchFromDbMultimedia(queryString) {
  // Returns a promise
  return db
    .any(queryString, [true])
    .then(data => {
      return data;
    })
    .catch(err => {
      utils.logExceptOnTest(err.stack);
    });
}

function fetchFromDb(queryString, mediaData) {
  // Returns a promise
  return db
    .any(queryString, [true])
    .then(data => {
      // need to format the geoJSON returned as a feature collection
      // for conversion
      for (var i = 0; i < data.length; i++) {
        data[i]['type'] = 'Feature';
        data[i]['properties'] = {
          // table/layer id should be included in the properties
          // attribute, not as a standalone attribute
          id: data[i].id,
          links: getLinkFromPath(mediaData, data[i].id)
        };
        delete data[i].id; // safe to remove this attribute
      }

      var geojson = {
        type: 'FeatureCollection',
        features: data
      };
      return geojson;
    })
    .catch(err => {
      utils.logExceptOnTest(err.stack);
    });
}

function generateMultimediaQuery(ids, tableName) {
  return (
    'SELECT id_in_layer, link ' +
    ' FROM multimedia_to_layer ' +
    "  WHERE layer_name = '" +
    tableName +
    "' AND id_in_layer IN(" +
    ids +
    ');'
  );
}

function generateQuery(ids, tableName) {
  // for now, we only need to work with these three tables/layers 
  if (tableName.localeCompare('construccion') == 0) {
    return (
      'SELECT id, ST_AsGeoJSON(geom)::json as geometry ' +
      ' FROM ' + tableName + ' WHERE id IN(' +
      ids +
      ');'
    );
  } else if (tableName.localeCompare('terreno') == 0) {
    return (
      'SELECT id, ST_AsGeoJSON(geom)::json As geometry' +
      ' FROM terreno WHERE id IN(' +
      ids +
      ');'
    );
  } else if (tableName.localeCompare('workshop_20170210') == 0) {
    return (
      'SELECT id, ST_AsGeoJSON(geom)::json As geometry' +
      ' FROM workshop_20170210 WHERE id IN(' +
      ids +
      ');'
    );
  }

  return undefined;
}

function getLinkFromPath(mediaData, id) {
  /* removes absolute path from multimedia links, e.g.: 
     /Users/Jerry/.../multimedia/img2.jpg >> img2.jpg 
  */
  var links = [];
  var j = 0;
  for (var i = 0; i < mediaData.length; i++) {
    if (mediaData[i].id_in_layer === id) {
      links[j] = mediaData[i].link.substring(
        mediaData[i].link.lastIndexOf('/') + 1
      );
      j++;
    }
  }
  return links;
}

/* no longer needed; keep here for research 

function generateQueryOld(ids,tableName){
  if(tableName.localeCompare('construccion') == 0){
      return 'SELECT row_to_json(row(id, ST_AsGeoJSON(geom),"OBJECTID", "CODIGO", '
          +' "TERRENO_CODIGO", "TIPO_CONSTRUCCION", "TIPO_DOMINIO", "NUMERO_PISOS", '
          +' "NUMERO_SOTANOS", "NUMERO_MEZANINES", "NUMERO_SEMISOTANOS", "ETIQUETA", '
          +' "IDENTIFICADOR", "CODIGO_EDIFICACION", "CODIGO_ANTERIOR", "SHAPE.AREA", "SHAPE.LEN", wkt))'
          + ' FROM construccion WHERE id IN('+ ids +');'
  }else if(tableName.localeCompare('terreno') == 0){
      return 'SELECT row_to_json(row(id, ST_AsGeoJSON(geom),"OBJECTID", "CODIGO",'
          +' "CODIGO_ANTERIOR", "SHAPE.AREA", "SHAPE.LEN", wkt))'
          + ' FROM terreno WHERE id IN('+ ids +');'
  }else if(tableName.localeCompare('workshop_20170210') == 0){
      return 'SELECT row_to_json(row(id, ST_AsGeoJSON(geom),codigo, fuente, wkt))'
          + ' FROM workshop_20170210 WHERE id IN('+ ids +');'
  }
  
  return undefined;
}

*/

module.exports.fetchFromDb = fetchFromDb;
module.exports.generateQuery = generateQuery;
module.exports.generateMultimediaQuery = generateMultimediaQuery;
module.exports.fetchFromDbMultimedia = fetchFromDbMultimedia;
