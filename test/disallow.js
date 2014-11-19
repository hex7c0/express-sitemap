'use strict';
/**
 * @file express-sitemap disallow test
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
describe('disallow', function() {

  var txt = 'd.txt';
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

  it('disallow all', function(done) {

    sitemap({
      robots: txt,
      route: {
        'ALL': {
          disallow: true,
        }
      },
      generate: app
    }).TXTtoFile();

    fs.readFile(txt, {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        throw err;
      assert.equal(data, 'User-agent: *\nDisallow: /\n', 'disallow all');
      fs.unlink(txt, function() {

        done();
      });
    });
  });
  it('disallow /admin', function(done) {

    sitemap({
      robots: txt,
      route: {
        '/a': {
          disallow: true,
        }
      },
      generate: app
    }).TXTtoFile();

    fs.readFile(txt, {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        throw err;
      assert.equal(data, 'User-agent: *\nDisallow: /a\n', 'disallow /a');
      fs.unlink(txt, function() {

        done();
      });
    });
  });
});
