'use strict';
/**
 * @file robots callback test
 * @module express-sitemap
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var sitemap = require('..');
var app = require('express')();
var assert = require('assert');
var fs = require('fs');
var request = require('supertest');

/*
 * test module
 */
describe('robots', function() {

  var txt = 'd.txt';

  before(function(done) {

    app.all('/', function(req, res) {

      res.send('hello /');
    }).get('/a', function(req, res) {

      res.send('hello /a');
    }).post('/A', function(req, res) {

      res.send('hello /A');
    });
    done();
  });

  describe('file', function() {

    describe('disallow all', function() {

      it('should write Robots to file', function(done) {

        sitemap({
          route: {
            'ALL': {
              disallow: true,
            }
          },
          generate: app
        }).TXTtoFile(txt, done);
      });
      it('should read this file', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.equal(data, 'User-agent: *\nDisallow: /\n', 'disallow all');
            fs.unlink(txt, done);
          });
        }, 50);
      });
    });

    describe('disallow /admin', function() {

      it('should write Robots to file', function(done) {

        sitemap({
          route: {
            '/a': {
              disallow: true,
            }
          },
          generate: app
        }).TXTtoFile(txt, done);
      });
      it('should read this file', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.equal(data, 'User-agent: *\nDisallow: /a\n', 'disallow /a');
            fs.unlink(txt, done);
          });
        }, 50);
      });
    });

    describe('sitemapSubmission', function() {

      it('should write Robots to file', function(done) {

        sitemap({
          sitemapSubmission: '/foo',
          generate: app
        }).TXTtoFile(txt, done);
      });
      it('should read this file', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.equal(data,
              'User-agent: *\nDisallow: \nSitemap: http://127.0.0.1/foo');
            fs.unlink(txt, done);
          });
        }, 50);
      });
    });
  });
});
