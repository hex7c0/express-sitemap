'use strict';
/**
 * @file alternate language pages example
 * @module express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author kfritsch
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
});

/*
 * sitemap
 */
sitemap({
  sitemap: 'alternate_lang.xml', // path for .XMLtoFile
  robots: 'alternate_lang.txt', // path for .TXTtoFile
  generate: app, // option or function, is the same
  route: { // specific option for some route
    '/': {
      lastmod: '2014-06-19',
      changefreq: 'always',
      priority: 1.0,
      alternatepages: [
      {
        rel: 'alternate',
        hreflang: 'de-ch',
        href: 'http://www.example.com/schweiz-deutsch/'
      },
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'http://www.example.com/english/'
      }]
    },
  },
}).toFile(); // write sitemap.xml and robots.txt

console.log('files wrote');
