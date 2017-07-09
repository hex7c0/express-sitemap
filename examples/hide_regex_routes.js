'use strict';
/**
 * @file hide routes that have regex
 * @module express-sitemap
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
}).get(/.-[0-9]+(\/)$/, function(req, res) {

  res.send('hello 1° regex');
}).get(/foo(\/)$/, function(req, res) {

  res.send('hello 2° regex');
});

var mapping = {
  '/.-[0-9]+(\\/)$/': {
    hide: true
  }
};
mapping[/foo(\/)$/.toString()] = {
  hide: true
};

/*
 * sitemap
 */
sitemap({
  sitemap: 'hide.xml', // path for .XMLtoFile
  robots: 'hide.txt', // path for .TXTtoFile
  generate: app, // option or function, is the same
  sitemapSubmission: '/hide.xml', // path of sitemap into robots
  route: mapping
}).toFile(); // write sitemap.xml and robots.txt

console.log('files wrote');
