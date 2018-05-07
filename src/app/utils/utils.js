/*
  name: utils.js
  modified last by: guru
  date last modified: 5 may 2018
*/


function logExceptOnTest(string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(string);
  }
}

module.exports.logExceptOnTest = logExceptOnTest;