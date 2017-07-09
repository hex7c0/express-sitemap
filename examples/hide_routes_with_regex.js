'use strict';
/**
 * @file hide routes with regex
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
app.get('/user', function(req, res) {

  res.send('hello /user');
}).get('/user/login', function(req, res) {

  res.send('hello /user/login');
}).get('/user/logout', function(req, res) {

  res.send('hello /user/logout');
}).get('/user/account', function(req, res) {

  res.send('hello /user/account');
}).get('/user/hex7c0', function(req, res) {

  res.send('hello /user/hex7c0');
});

/*
 * sitemap
 */
sitemap({
  sitemap: 'regex.xml', // path for .XMLtoFile
  robots: 'regex.txt', // path for .TXTtoFile
  generate: app, // option or function, is the same
  hideByRegex: [ /^\/user(\/(?!hex7c0).*)?$/ ]
}).toFile(); // write sitemap.xml and robots.txt

console.log('files wrote');
