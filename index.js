'use strict';
/**
 * @file express-sitemap main
 * @module express-sitemap
 * @subpackage main
 * @version 1.5.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var fs = require('fs');
var setHeaders = require('setheaders').setWritableHeader;

/*
 * functions
 */
/**
 * write data to file
 * 
 * @function write
 * @param {String} data - created xml or robots.txt
 * @param {String} file - name of file
 */
function write(data, file) {

  return fs.writeFile(file, data, function(err) {

    return err !== null ? console.error(err) : null;
  });
}

/**
 * stream data to web
 * 
 * @function stream
 * @param {String} data - created xml or robots.txt
 * @param {Object} res - response to client
 * @param {String} header - send header to client
 */
function stream(data, res, header) {

  return setHeaders(res, 'Content-Type', header) === true ? res.send(data)
    : null;
}

/**
 * export class
 * 
 * @exports sitemap
 * @function sitemap
 * @return {Sitemap}
 */
function sitemap(options) {

  return new Sitemap(options);
}
module.exports = sitemap;

/*
 * class
 */
/**
 * Sitemap class
 * 
 * @class Sitemap
 * @param {Object} options - various options. Check README.md
 * @return {Object}
 */
function Sitemap(options) {

  var resolve = require('path').resolve;

  var opt = options || Object.create(null);
  var http = opt.http == 'https' ? 'https://' : 'http://';
  var url = String(opt.url || '127.0.0.1');
  var port = isNaN(opt.port) ? '' : ':' + Number(opt.port);

  this.my = {
    url: http + url + port,
    sitemap: String(opt.sitemap || 'sitemap.xml'),
    robots: String(opt.robots || 'robots.txt'),
    route: typeof (opt.route) == 'object' ? opt.route : Object.create(null),
    cache: Number(opt.cache) || false
  };

  this.my.sitemap = resolve(this.my.sitemap);
  this.my.robots = resolve(this.my.robots);
  this.map = typeof (opt.map) == 'object' ? opt.map : Object.create(null);

  this._XMLwork = this.xml;
  this._TXTwork = this.txt;
  if (opt.cache) { // cache override
    this.cache = {
      xml: {
        timestamp: 0
      },
      txt: {
        timestamp: 0
      }
    };
    this._XMLwork = this._XMLcache;
    this._TXTwork = this._TXTcache;
  }

  if (opt.generate) {
    this.generate(opt.generate);
  }
  return;
}

/**
 * wrapper for generate sitemap object
 * 
 * @function generate3
 * @param {Object} app - express app
 * @param {Object} [router] - express nested router path
 * @param {Boolean} [store] - store this path inside class
 * @return {Object}
 */
Sitemap.prototype.generate = function(app, router, store) {

  if (app) {
    if (app._router) {
      if (app._router.stack) { // express@4
        return this.generate4(app, router, store);
      } else if (app._router.map) { // express@3
        return this.generate3(app, router, store);
      }
    } else if (app.stack) { // express@4.Router
      return this.generate4(app, router, store);
    }
  }
  throw new Error('missing express configuration');
};

/**
 * generate sitemap object for express4. GET only
 * 
 * @function generate4
 * @param {Object} app - express app
 * @param {Object} [router] - express nested router path
 * @param {Boolean} [store] - store this path inside class
 * @return {Object}
 */
Sitemap.prototype.generate4 = function(app, router, store) {

  var map = Object.create(null);
  var routing = app._router !== undefined ? app._router.stack : app.stack;

  for (var i = 0, ii = routing.length; i < ii; i++) {
    var route = routing[i];

    if (route.route) { // direct
      route = routing[i].route;
      if (route && route.methods && (route.methods.get || route.methods._all)) {
        map[route.path] = [ 'get' ];
      }

    } else if (route.handle && route.handle.stack && router) { // router
      var handle;
      for (var j = 0, jj = router.length; j < jj; j++) {
        if (route.regexp.test(router[j])) {
          handle = router[j];
          break;
        }
      }
      if (handle) {
        if (handle === '/') {
          handle = ''; // fix for default `app.use()`
        }
        var route = this.generate4(route.handle, router, false); // recursive
        if (route) {
          route = Object.keys(route);
          for (j = 0, jj = route.length; j < jj; j++) {
            map[handle + route[j]] = [ 'get' ];
          }
        }
      }
    }

  }
  if (store !== false) {
    for (routing in map) {
      this.map[routing] = map[routing];
    }
  }
  return map;
};

/**
 * generate sitemap object for express3. GET only
 * 
 * @function generate3
 * @param {Object} app - express app
 * @param {Object} [router] - express nested router path
 * @param {Boolean} [store] - store this path inside class
 * @return {Object}
 */
Sitemap.prototype.generate3 = function(app, router, store) {

  var map = Object.create(null);
  var routing = app.routes.get;

  for (var i = 0, ii = routing.length; i < ii; i++) {
    var route = routing[i];
    if (route && route.path) {
      map[route.path] = [ 'get' ];
    }
  }

  if (store !== false) {
    this.map = map;
  }
  return map;
};

/**
 * generate sitemap object with tickle
 * 
 * @function tickle
 * @return {Object}
 */
Sitemap.prototype.tickle = function() {

  if (global.tickle !== undefined && global.tickle.route !== undefined) {
    for ( var route in global.tickle.route) {
      this.map[route] = []; // don't know type of Verb
    }
    return this.map;
  }
  return Object.create(null);
};

/**
 * reset
 * 
 * @function reset
 * @return {Object}
 */
Sitemap.prototype.reset = function() {

  var r = Object.create(null);
  this.map = r;
  if (this.my.cache) {
    this.cache = {
      xml: {
        timestamp: 0
      },
      txt: {
        timestamp: 0
      }
    };
  }
  return r;
};

/**
 * create xml from sitemap
 * 
 * @function xml
 * @return {String}
 */
Sitemap.prototype.xml = function() {

  var route = this.my.route;
  var sitemap = this.map;
  var data = '<?xml version="1.0" encoding="UTF-8"?>';
  data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for ( var uri in sitemap) {
    var rr = route.ALL || route[uri] || false;
    if (!rr || (!rr.disallow && !rr.hide)) {
      data += '<url><loc>' + this.my.url + uri + '</loc>';
      if (typeof rr === 'object') {
        if (rr.lastmod !== undefined) {
          data += '<lastmod>' + rr.lastmod + '</lastmod>';
        }
        if (rr.changefreq !== undefined) {
          data += '<changefreq>' + rr.changefreq + '</changefreq>';
        }
        if (rr.priority !== undefined) {
          data += '<priority>' + rr.priority + '</priority>';
        }
      }
      data += '</url>';
    }
  }
  data += '</urlset>';
  return data;
};

/**
 * create txt from sitemap
 * 
 * @function robots
 * @return {String}
 */
Sitemap.prototype.txt = function() {

  var temp = true;
  var route = this.my.route;
  var sitemap = this.map;
  var data = 'User-agent: *\n';
  for ( var uri in sitemap) {
    var rr = route[uri];
    if (route.ALL && route.ALL.disallow && !route.ALL.hide) {
      temp = false;
      data += 'Disallow: /\n';
      break;
    } else if (rr && rr.disallow && !rr.hide) {
      temp = false;
      data += 'Disallow: ' + uri + '\n';
    }
  }
  if (temp) {
    data += 'Disallow: \n';
  }
  return data;
};

/**
 * alias for write sitemap to file
 * 
 * @function XMLtoFile
 * @param {String} [path] override class location
 * @return
 */
Sitemap.prototype.XMLtoFile = function(path) {

  return write(this._XMLwork(), path || this.my.sitemap);
};

/**
 * alias for write robots.txt to file
 * 
 * @function TXTtoFile
 * @param {String} [path] override class location
 * @return
 */
Sitemap.prototype.TXTtoFile = function(path) {

  return write(this._TXTwork(), path || this.my.robots);
};

/**
 * alias for write both to files
 * 
 * @function toFile
 * @return
 */
Sitemap.prototype.toFile = function() {

  write(this._XMLwork(), this.my.sitemap);
  write(this._TXTwork(), this.my.robots);
  return;
};

/**
 * alias for stream sitemap to web
 * 
 * @function XMLtoWeb
 * @param {Object} res - response to client
 * @return
 */
Sitemap.prototype.XMLtoWeb = function(res) {

  return stream(this._XMLwork(), res, 'application/xml');
};

/**
 * alias for stream robots.txt to web
 * 
 * @function TXTtoWeb
 * @param {Object} res - response to client
 * @return
 */
Sitemap.prototype.TXTtoWeb = function(res) {

  return stream(this._TXTwork(), res, 'text/plain');
};

/**
 * check xml cache hit or refresh
 * 
 * @function _XMLcache
 * @return {string}
 */
Sitemap.prototype._XMLcache = function() {

  if ((this.cache.xml.timestamp - Date.now()) > 0) {
    return this.cache.xml.data;
  }
  var data = this.xml();
  this.cache.xml = {
    timestamp: Date.now() + this.my.cache,
    data: data
  };
  return data;
};

/**
 * check txt cache hit or refresh
 * 
 * @function _TXTcache
 * @return {string}
 */
Sitemap.prototype._TXTcache = function() {

  if ((this.cache.txt.timestamp - Date.now()) > 0) {
    return this.cache.txt.data;
  }
  var data = this.txt();
  this.cache.txt = {
    timestamp: Date.now() + this.my.cache,
    data: data
  };
  return data;
};
