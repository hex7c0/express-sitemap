'use strict';
/**
 * @file nested express router
 * @module express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var map = require('..');
var express = require('express');
var father = express();
var child = express.Router();

child.get('/', function(req, res) {

  res.send('hello /');
}).get('/admin', function(req, res) {

  res.send('hello /admin');
}).post('/admin', function(req, res) {

  res.send('hello /admin');
}).get('/duplicate', function(req, res) {

  res.send('hello /duplicate');
}).get('/duplicate/:id', function(req, res) {

  res.send('hello /duplicate');
}).post('/foo', function(req, res) {

  res.send('hello /foo');
}).put('/nooo', function(req, res) {

  res.send('hello /nooo');
}).all('/all', function(req, res) {

  res.send('hello /all');
});

father.use('/c', child);

var sitemap = map();

console.log('Child');
console.log(sitemap.generate4(child));
sitemap.reset();

console.log('Father without Router path');
console.log(sitemap.generate4(father)); // should return {} because no Router path
sitemap.reset();

console.log('Father with Router path');
console.log(sitemap.generate4(father, [ '/c' ])); // should return same obj of child with /c path
sitemap.reset();
