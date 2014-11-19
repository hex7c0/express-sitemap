'use strict';
/**
 * @file express-sitemap generate test
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
  var sitemap = require('..'); // use require('express-sitemap')
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
describe('generate', function() {

  var s;
  before(function(done) {

    app.all('/', function(req, res) {

      res.send('hello /');
    });
    app.get('/a', function(req, res) {

      res.send('hello /admin');
    });
    app.post('/A', function(req, res) {

      res.send('hello /admin');
    });
    s = sitemap({
      generate: app
    });
    done();
  });

  it('should check "map" Object', function(done) {

    assert.equal(typeof s.map, 'object');
    assert.equal(Object.keys(s.map).length, 2);
    assert.equal(s.map['/'][0], 'get');
    assert.equal(s.map['/a'][0], 'get');
    done();
  });
  it('should return "map" Object after `generate()`', function(done) {

    var m = s.map;
    var g = s.generate(app);

    assert.equal(typeof s.map, 'object');
    assert.equal(Object.keys(s.map).length, 2);
    assert.equal(s.map['/'][0], 'get');
    assert.equal(s.map['/a'][0], 'get');
    assert.deepEqual(s.map, m);
    assert.deepEqual(s.map, g);
    done();
  });
});
