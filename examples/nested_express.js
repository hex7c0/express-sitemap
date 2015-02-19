'use strict';
/**
 * @file nested express
 * @module express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var map = require('..');
var express = require('express');
var father = express();
var child = express();

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

father.use(child);
father.listen(3000);
console.log('starting "hello world" on port 3000');
var sitemap = map();

console.log('Father');
console.log(sitemap.generate(father));
sitemap.reset();

console.log('Child');
console.log(sitemap.generate(child));
sitemap.reset();
