'use strict';
/**
 * @file express-sitemap sitemap test
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  var sitemap = require('..');
  // instead
  var app = require('express')();
  var assert = require('assert');
  var fs = require('fs');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('sitemap', function() {

  // no XML parsing
  var head = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  var tail = '</urlset>';
  var xml = 's.xml';
  before(function(done) {

    app.all('/', function(req, res) {

      res.send('hello /');
    });
    app.get('/a', function(req, res) {

      res.send('hello /a');
    });
    app.post('/A', function(req, res) {

      res.send('hello /A');
    });
    done();
  });

  it('should return sitemap from app', function(done) {

    sitemap({
      sitemap: xml,
      generate: app
    }).XMLtoFile();

    fs.readFile(xml, {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        throw err;
      var rs = '';
      rs += '<url><loc>http://127.0.0.1/</loc></url>';
      rs += '<url><loc>http://127.0.0.1/a</loc></url>';
      assert.equal(data, head + rs + tail);
      fs.unlink(xml, function() {

        done();
      });
    });
  });
  it('should return sitemap from app with "route"', function(done) {

    sitemap({
      sitemap: xml,
      generate: app,
      route: {
        '/a': {
          priority: 1.0
        }
      }
    }).XMLtoFile();

    fs.readFile(xml, {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        throw err;
      var rs = '';
      rs += '<url><loc>http://127.0.0.1/</loc></url>';
      rs += '<url><loc>http://127.0.0.1/a</loc><priority>1</priority></url>';
      assert.equal(data, head + rs + tail);
      fs.unlink(xml, function() {

        done();
      });
    });
  });
  it('should return sitemap with "route"', function(done) {

    sitemap({
      sitemap: xml,
      map: {
        '/foo': [ 'get' ],
        '/foo2': [ 'get', 'post' ],
        '/admin': [ 'get' ],
        '/backdoor': [],
      },
      route: {
        '/foo': {
          lastmod: '2014-00-00',
          changefreq: 'always',
          priority: 1.0
        },
        '/admin': {
          disallow: true
        },
        '/backdoor': {
          hide: true
        },
      }
    }).XMLtoFile();

    fs
        .readFile(xml, {
          encoding: 'utf8'
        }, function(err, data) {

          if (err)
            throw err;
          var rs = '';
          rs += '<url><loc>http://127.0.0.1/foo</loc><lastmod>2014-00-00</lastmod><changefreq>always</changefreq><priority>1</priority></url>';
          rs += '<url><loc>http://127.0.0.1/foo2</loc></url>';
          assert.equal(data, head + rs + tail);
          fs.unlink(xml, function() {

            done();
          });
        });
  });
  it('should return sitemap with "route" without "map"', function(done) {

    sitemap({
      sitemap: xml,
      route: {
        '/foo': {
          lastmod: '2014-00-00',
          changefreq: 'always',
          priority: 1.0
        },
        '/admin': {
          disallow: true
        },
        '/backdoor': {
          hide: true
        },
      }
    }).XMLtoFile();

    fs.readFile(xml, {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        throw err;

      assert.deepEqual(data, head + tail);
      fs.unlink(xml, function() {

        done();
      });
    });
  });
});
