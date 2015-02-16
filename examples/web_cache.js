'use strict';
/**
 * @file web example with cache
 * @module express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var sitemap = require('..'); // use require('express-sitemap') instead
var app = require('express')();

// express routing
app.get('/', function(req, res) {

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

/*
 * sitemap
 */
var map = sitemap({
  generate: app,
  cache: 60000, // enable 1m cache
});

app.get('/sitemap.xml', function(req, res) { // send XML map

  map.XMLtoWeb(res);
}).get('/robots.txt', function(req, res) { // send TXT map

  map.TXTtoWeb(res);
});

// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
