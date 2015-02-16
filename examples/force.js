'use strict';
/**
 * @file write static configuration to file
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

/*
 * sitemap
 */
sitemap({
  sitemap: 'force.xml', // path for .XMLtoFile
  robots: 'force.txt', // path for .TXTtoFile
  map: {
    '/foo': [ 'get' ],
    '/foo2': [ 'get', 'post' ],
    '/admin': [ 'get' ],
    '/backdoor': [], // always set an Array
  },
  route: { // specific a custom route
    '/foo': {
      lastmod: '2014-06-19',
      changefreq: 'always',
      priority: 1.0,
    },
    '/admin': {
      disallow: true, // write this route to robots.txt
    },
    '/backdoor': {
      hide: true, // exclude this route from xml and txt
    }
  }
}).toFile();

console.log('files wrote');
