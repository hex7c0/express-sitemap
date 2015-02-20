'use strict';
/**
 * @file nested callback
 * @module express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

var sitemap = require('..'); // use require('express-sitemap') instead
var express = require('express');
var father = express();
var child0 = express.Router();
var child1 = express.Router();
var child = express.Router();

child.get('/child', function(req, res) {

  res.send('hello /child');
});

child0.get('/', function(req, res) {

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
}).use('/c', child);

child1.get('/', function(req, res) {

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

father.get('/ciao0', function(req, res) {

  res.send('hello /ciao0');
}).use('/0', child0).get('/ciao1', function(req, res) {

  res.send('hello /ciao1');
}).use('/1', child1).get('/ciao2', function(req, res) {

  res.send('hello /ciao2');
});

var map = sitemap({
  sitemap: 'nested.xml'
});

map.generate4(father, [ '/0', '/1', '/c' ]); // generate sitemap with express router path

map.XMLtoFile();

console.log('file wrote');
