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

  before(function(done) {

    app.get('/', function(req, res) {

      res.send('hello /');
    });
    app.get('/admin', function(req, res) {

      res.send('hello /admin');
    });
    app.post('/admin', function(req, res) {

      res.send('hello /admin');
    });
    done();
  });

  it('disallow all', function(done) {

    sitemap({
      robots: 'p.txt',
      route: {
        'ALL': {
          disallow: true,
        }
      },
      generate: app
    }).TXTtoFile();
    fs.readFile('p.txt', {
      encoding: 'utf8'
    }, function(err, data) {

      if (err)
        return done(err);
      assert.deepEqual(data, 'User-agent: *\nDisallow: /\n', 'disallow all');
      fs.unlink('p.txt', function() {

        done();
      });
    });
  });
  it('disallow /admin', function(done) {

    sitemap({
      robots: 'p.txt',
      route: {
        '/admin': {
          disallow: true,
        }
      },
      generate: app
    }).TXTtoFile();
    fs
        .readFile('p.txt', {
          encoding: 'utf8'
        }, function(err, data) {

          if (err)
            return done(err);
          assert
              .deepEqual(data, 'User-agent: *\nDisallow: /admin\n', 'disallow /admin');
          fs.unlink('p.txt', function() {

            done();
          });
        });
  });
});
