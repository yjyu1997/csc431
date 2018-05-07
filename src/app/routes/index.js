/*
  name: index.js
  modified last by: jerry
  date last modified: 30 apr 2018

  For fake download page. Most likely a deprecated file
*/
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + "/../public/"});
});

module.exports = router;
