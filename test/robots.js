'use strict';
/**
 * @file robots test
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

var txtWithAllRoutes = 'User-agent: *\nAllow: /user\nAllow: /user/hex7c0\n';
var txtWithRightRoute = 'User-agent: *\nAllow: /user/hex7c0\n';

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
    }).get('/b', function(req, res) {

      res.send('hello /b');
    }).post('/B', function(req, res) {

      res.send('hello /B');
    });
    done();
  });

  describe('file', function() {

    describe('hideByRegexArray', function() {

      var options;

      before(function(done) {

        options = {
          map: {
            '/user': [ 'get' ],
            '/user/login': [ 'get' ],
            '/user/logout': [ 'get' ],
            '/user/account': [ 'get' ],
            '/user/hex7c0': [ 'get' ],
          },
          route: {
            '/user': { // not shown
              allow: true
            },
            '/user/hex7c0': {
              allow: true
            }
          }
        };
        done();
      });

      it('should write Robots to file with option a boolean', function(done) {

        options.hideByRegex = true;
        sitemap(options).TXTtoFile(txt);
        done();
      });
      it('should read routes because option is a boolean', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.deepEqual(data, txtWithAllRoutes);
            fs.unlink(txt, done);
          });
        }, 50);
      });
      it('should write Robots to file with option as object', function(done) {

        options.hideByRegex = {
          foo: 'bar'
        };
        sitemap(options).TXTtoFile(txt);
        done();
      });
      it('should read routes because options is an object', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.deepEqual(data, txtWithAllRoutes);
            fs.unlink(txt, done);
          });
        }, 50);
      });
      it('should write Robots to file with option an array of string',
        function(done) {

          options.hideByRegex = [ 'foobar' ];
          sitemap(options).TXTtoFile(txt);
          done();
        });
      it('should read routes because option is an array of string',
        function(done) {

          setTimeout(function() {

            fs.readFile(txt, {
              encoding: 'utf8'
            }, function(err, data) {

              assert.ifError(err);
              assert.deepEqual(data, txtWithAllRoutes);
              fs.unlink(txt, done);
            });
          }, 50);
        });
      it('should write right Robots to file', function(done) {

        options.hideByRegex = [ /^\/user(\/(?!hex7c0).*)?$/ ];
        sitemap(options).TXTtoFile(txt);
        done();
      });
      it('should read right route', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.deepEqual(data, txtWithRightRoute);
            fs.unlink(txt, done);
          });
        }, 50);
      });
    });

    describe('mapping', function() {

      it('should write Robots to file', function(done) {

        sitemap({
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
        }).TXTtoFile(txt);
        done();
      });
      it('should read this file', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.equal(data, 'User-agent: *\nAllow: /p\nDisallow: /p/foo\n');
            fs.unlink(txt, done);
          });
        }, 50);
      });
    });

    describe('disallow all', function() {

      it('should write Robots to file', function(done) {

        sitemap({
          route: {
            'ALL': {
              disallow: true,
            }
          },
          generate: app
        }).TXTtoFile(txt);
        done();
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
        }).TXTtoFile(txt);
        done();
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

    describe('allow /admin', function() {

      it('should write Robots to file', function(done) {

        sitemap({
          route: {
            '/a': {
              allow: true,
            }
          },
          generate: app
        }).TXTtoFile(txt);
        done();
      });
      it('should read this file', function(done) {

        setTimeout(function() {

          fs.readFile(txt, {
            encoding: 'utf8'
          }, function(err, data) {

            assert.ifError(err);
            assert.equal(data, 'User-agent: *\nAllow: /a\n', 'allow /a');
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
        }).TXTtoFile(txt);
        done();
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

  describe('web', function() {

    before(function(done) {

      var map = sitemap({
        cache: 60,
        route: {
          '/a': {
            disallow: true,
          },
          '/b': {
            allow: true,
          }
        },
        generate: app
      });
      app.get('/robots.txt', function(req, res) {

        map.TXTtoWeb(res);
      });
      done();
    });

    it('should get robots from web', function(done) {

      request(app).get('/robots.txt').expect(200).expect('Content-Type',
        /text\/plain/).end(
        function(err, res) {

          assert.ifError(err);
          assert.equal(res.text, 'User-agent: *\nDisallow: /a\nAllow: /b\n',
            'disallow /a');
          done();
        });
    });
    it('should get robots from web cache', function(done) {

      request(app).get('/robots.txt').expect(200).expect('Content-Type',
        /text\/plain/).end(
        function(err, res) {

          assert.ifError(err);
          assert.equal(res.text, 'User-agent: *\nDisallow: /a\nAllow: /b\n',
            'disallow /a');
          done();
        });
    });
  });
});
