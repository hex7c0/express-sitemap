'use strict';
/**
 * @file write robots file with Allow route
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
app.get('/p', function(req, res) {

  res.send('hello /p');
}).get('/p/foo', function(req, res) {

  res.send('hello /p/foo');
});

/*
 * express
 */
sitemap({
  generate: app,
  robots: 'robots/robots_allow_express.txt', // custom path inside a dir
  route: {
    '/p': {
      allow: true
    },
    '/p/foo': {
      disallow: true
    }
  }
}).TXTtoFile();

/*
 * mapping
 */
sitemap({
  robots: 'robots/robots_allow_mapping.txt', // custom path inside a dir
  map: {
    '/p': [ 'get' ],
    '/p/foo': [ 'get' ],
  },
  route: { // specific a custom route
    '/p': {
      allow: true
    },
    '/p/foo': {
      disallow: true, // write this route to robots.txt
    }
  }
}).TXTtoFile();

console.log('files wrote');
