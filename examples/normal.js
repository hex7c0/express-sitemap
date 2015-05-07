'use strict';
/**
 * @file classic example
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
app.all('/', function(req, res) {

  res.send('hello /');
}).all('/all', function(req, res) {

  res.send('hello /all');
}).get('/admin', function(req, res) {

  res.send('hello /admin');
}).get('/duplicate', function(req, res) {

  res.send('hello /duplicate');
}).get('/duplicate/:id', function(req, res) {

  res.send('hello /duplicate');
}).post('/admin', function(req, res) {

  res.send('hello /admin');
}).post('/foo', function(req, res) {

  res.send('hello /foo');
}).put('/nooo', function(req, res) {

  res.send('hello /nooo');
});

/*
 * sitemap
 */
sitemap({
  sitemap: 'normal.xml', // path for .XMLtoFile
  robots: 'normal.txt', // path for .TXTtoFile
  generate: app, // option or function, is the same
  sitemapSubmission: '/normal.xml', // path of sitemap into robots
  route: { // specific option for some route
    '/': {
      lastmod: '2014-06-19',
      changefreq: 'always',
      priority: 1.0,
    },
    '/admin': {
      disallow: true, // write this route to robots.txt
    },
    '/nooo': {
      lastmod: '2014-06-20',
      changefreq: 'never',
    }
  },
}).toFile(); // write sitemap.xml and robots.txt

console.log('files wrote');
