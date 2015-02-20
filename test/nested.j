'use strict';
/**
 * @file express-sitemap nested test
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
var sitemap = require('..')();
var express = require('express');
var request = require('supertest');
var assert = require('assert');

/*
 * test module
 */
describe('nested', function() {

  var map;
  var father = express();
  var child0 = express.Router();
  var child1 = express.Router();
  var child = express.Router();

  before(function(done) {

    child.get('/child', function(req, res) {

      res.send('hello /child');
    });

    child0.get('/', function(req, res) {

      res.send('hello /');
    }).get('/admin', function(req, res) {

      res.send('hello /admin');
    }).post('/admin', function(req, res) {

      res.send('hello /admin');
    }).get('/duplicate', function(req, res) {

      res.send('hello /duplicate');
    }).get('/duplicate/:id', function(req, res) {

      res.send('hello /duplicate');
    }).post('/foo', function(req, res) {

      res.send('hello /foo');
    }).put('/nooo', function(req, res) {

      res.send('hello /nooo');
    }).all('/all', function(req, res) {

      res.send('hello /all');
    }).use('/c', child);

    child1.get('/', function(req, res) {

      res.send('hello /');
    }).get('/admin', function(req, res) {

      res.send('hello /admin');
    }).post('/admin', function(req, res) {

      res.send('hello /admin');
    }).get('/duplicate', function(req, res) {

      res.send('hello /duplicate');
    }).get('/duplicate/:id', function(req, res) {

      res.send('hello /duplicate');
    }).post('/foo', function(req, res) {

      res.send('hello /foo');
    }).put('/nooo', function(req, res) {

      res.send('hello /nooo');
    }).all('/all', function(req, res) {

      res.send('hello /all');
    });

    father.get('/ciao0', function(req, res) {

      res.send('hello /ciao0');
    }).use('/0', child0).get('/ciao1', function(req, res) {

      res.send('hello /ciao1');
    }).use('/1', child1).get('/ciao2', function(req, res) {

      res.send('hello /ciao2');
    });
    done();
  });

  describe('without router', function() {

    it('should generate sitemap from father without router', function(done) {

      map = Object.keys(sitemap.generate(father));
      assert.equal(map.length, 3);
      done();
    });
    it('should try every route in sitemap', function(done) {

      var c = 0;
      map.forEach(function(route) {

        request(father).get(route).expect(200).end(function(err, res) {

          if (++c >= 3) {
            done();
          }
        });
      });
    });
  });

  describe('with router', function() {

    it('should generate sitemap from father without router', function(done) {

      map = Object.keys(sitemap.generate(father, [ '/0', '/1', '/c' ]));
      assert.equal(map.length, 14);
      done();
    });
    it('should try every route in sitemap', function(done) {

      var c = 0;
      map.forEach(function(route) {

        request(father).get(route).expect(200).end(function(err, res) {

          if (++c >= 14) {
            done();
          }
        });
      });
    });
  });
});
