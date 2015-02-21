'use strict';
/**
 * @file write all GET route to file
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
var map = require('..'); // use require('express-sitemap') instead
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
var sitemap = map({
  sitemap: 'all.xml', // path for .XMLtoFile
  route: {
    'ALL': {
      lastmod: '2014-06-20',
      changefreq: 'always',
      priority: 1.0,
    }
  },
});

sitemap.generate(app); // generate sitemap from express route, you can set generate inside sitemap({})

sitemap.XMLtoFile(); // write this map to file

console.log('file wrote');
