'use strict';
/**
 * @file web example with tickle integration
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
var express = require('express');
var tickle = require('tickle');
var child = express();

child.use(tickle);

// express routing
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

/*
 * try now :)
 */
var map;
child.get('/sitemap.xml', function(req, res) {

  map.tickle(); // refresh this map
  map.XMLtoWeb(res);
});

// server starting
child.listen(3000);
console.log('starting "hello world" on port 3000');

map = sitemap();

console.log(map.generate(child)); // generate XML and print to console

map.reset(); // reset this map

// now your sitemap is empty (after reset)
// if you navigate to every route, it will be stored inside "tickle" container
// and when you go to /sitemap.xml, it will show the new routes
