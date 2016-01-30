'use strict';
/**
 * @file sitemap callback test
 * @module express-sitemap
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var sitemap = require('..');
var app = require('express')();
var assert = require('assert');
var fs = require('fs');
var request = require('supertest');

/*
 * test module
 */
describe(
  'sitemapCallback',
  function() {

    // no XML parsing
    var head = '<?xml version="1.0" encoding="UTF-8"?>';
    head += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    var lang = head + ' xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    head += '>';
    var tail = '</urlset>';
    var xml = 's.xml';

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

    describe(
      'file',
      function() {

        it('should write sitemap from app', function(done) {

          sitemap({
            generate: app
          }).XMLtoFile(xml, done);
        });
        it('should read sitemap', function(done) {

          setTimeout(function() {

            fs.readFile(xml, {
              encoding: 'utf8'
            }, function(err, data) {

              assert.ifError(err);
              var rs = '';
              rs += '<url><loc>http://127.0.0.1/</loc></url>';
              rs += '<url><loc>http://127.0.0.1/a</loc></url>';
              assert.equal(data, head + rs + tail);
              fs.unlink(xml, done);
            });
          }, 50);
        });
        it('should write sitemap from app with "route"', function(done) {

          sitemap({
            generate: app,
            route: {
              '/a': {
                priority: 1.0
              }
            }
          }).XMLtoFile(xml, done);
        });
        it('should read sitemap', function(done) {

          setTimeout(function() {

            fs.readFile(xml, {
              encoding: 'utf8'
            }, function(err, data) {

              assert.ifError(err);
              var rs = '';
              rs += '<url><loc>http://127.0.0.1/</loc></url>';
              rs += '<url><loc>http://127.0.0.1/a</loc>';
              rs += '<priority>1</priority></url>';
              assert.equal(data, head + rs + tail);
              fs.unlink(xml, done);
            });
          }, 50);
        });
        it('should write sitemap with "route"', function(done) {

          sitemap({
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
          }).XMLtoFile(xml, done);
        });
        it(
          'should read sitemap',
          function(done) {

            setTimeout(
              function() {

                fs
                    .readFile(
                      xml,
                      {
                        encoding: 'utf8'
                      },
                      function(err, data) {

                        assert.ifError(err);
                        var rs = '';
                        rs += '<url><loc>http://127.0.0.1/foo</loc>';
                        rs += '<lastmod>2014-00-00</lastmod><changefreq>always</changefreq>';
                        rs += '<priority>1</priority></url>';
                        rs += '<url><loc>http://127.0.0.1/foo2</loc></url>';
                        assert.equal(data, head + rs + tail);
                        fs.unlink(xml, done);
                      });
              }, 50);
          });
        it('should write sitemap with alternate lang pages', function(done) {

          sitemap({
            map: {
              '/foo': [ 'get' ],
            },
            route: {
              '/foo': {
                lastmod: '2014-00-00',
                changefreq: 'always',
                priority: 1.0,
                alternatepages: [ {
                  rel: 'alternate',
                  hreflang: 'de-ch',
                  href: 'http://www.example.com/schweiz-deutsch/'
                }, {
                  rel: 'alternate',
                  hreflang: 'en',
                  href: 'http://www.example.com/english/'
                } ]
              }
            }
          }).XMLtoFile(xml, done);
        });
        it(
          'should read sitemap',
          function(done) {

            setTimeout(
              function() {

                fs
                    .readFile(
                      xml,
                      {
                        encoding: 'utf8'
                      },
                      function(err, data) {

                        assert.ifError(err);
                        var rs = '';
                        rs += '<url><loc>http://127.0.0.1/foo</loc>';
                        rs += '<lastmod>2014-00-00</lastmod><changefreq>always</changefreq>';
                        rs += '<priority>1</priority>';
                        rs += '<xhtml:link rel="alternate" hreflang="de-ch" href="http://www.example.com/schweiz-deutsch/" />';
                        rs += '<xhtml:link rel="alternate" hreflang="en" href="http://www.example.com/english/" />';
                        rs += '</url>';
                        assert.equal(data, lang + rs + tail);
                        fs.unlink(xml, done);
                      });
              }, 50);
          });
        it('should write sitemap with "route" without "map"', function(done) {

          sitemap({
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
          }).XMLtoFile(xml, done);
        });
        it('should read sitemap', function(done) {

          setTimeout(function() {

            fs.readFile(xml, {
              encoding: 'utf8'
            }, function(err, data) {

              assert.ifError(err);
              assert.deepEqual(data, head + tail);
              fs.unlink(xml, done);
            });
          }, 50);
        });
      });
  });
