'use strict';
/**
 * @file express-sitemap main
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage main
 * @version 1.3.4
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var fs = require('fs');
    var resolve = require('path').resolve;
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

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

        if (err) {
            console.error(err);
        }
        return;
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

    var re = res.res || res;
    re.header('Content-Type', header);
    re.send(data);
    return;
}

/**
 * export class
 * 
 * @exports sitemap
 * @function sitemap
 * @return {SITEMAP}
 */
module.exports = function sitemap(options) {

    return new SITEMAP(options);
};

/*
 * class
 */
/**
 * SITEMAP class
 * 
 * @class SITEMAP
 * @param {Object} options - various options. Check README.md
 * @return {Object}
 */
function SITEMAP(options) {

    var opt = options || Object.create(null);
    var http = opt.http == 'https' ? 'https://' : 'http://';
    var url = String(opt.url || '127.0.0.1');
    var port = Number(opt.port) ? ':' + Number(opt.port) : '';
    this.my = {
        url: http + url + port,
        sitemap: String(opt.sitemap || 'sitemap.xml'),
        robots: String(opt.robots || 'robots.txt'),
        route: typeof (opt.route) == 'object' ? opt.route : Object.create(null),
    };
    this.my.sitemap = resolve(this.my.sitemap);
    this.my.robots = resolve(this.my.robots);
    this.map = typeof (opt.map) == 'object' ? opt.map : Object.create(null);
    if (opt.generate && opt.generate._router) {
        this.generate(opt.generate);
    }
    return;
}
/**
 * generate sitemap object
 * 
 * @function generate
 * @param {Object} app - express app
 * @return {Object}
 */
SITEMAP.prototype.generate = function(app) {

    var that = this.map;
    var routing = app._router.stack;
    for (var i = 0, il = routing.length; i < il; i++) {
        var route = routing[i].route;
        if (route) {
            var path = route.path;
            if (route.methods.get) {
                that[path] = [ 'get' ];
            }
        }
    }
    return that;
};
/**
 * generate sitemap object with tickle
 * 
 * @function tickle
 * @return {Object}
 */
SITEMAP.prototype.tickle = function() {

    if (GLOBAL.tickle && GLOBAL.tickle.route) {
        var that = this.map;
        var routing = GLOBAL.tickle.route;
        for ( var route in routing) {
            that[route] = [];
        }
        return that;
    }
    return Object.create(null);
};
/**
 * reset
 * 
 * @function reset
 */
SITEMAP.prototype.reset = function() {

    this.map = Object.create(null);
    return;
};
/**
 * create xml from sitemap
 * 
 * @function xml
 * @return {String}
 */
SITEMAP.prototype.xml = function() {

    var temp = null;
    var route = this.my.route;
    var sitemap = this.map;
    var data = '<?xml version="1.0" encoding="UTF-8"?>';
    data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for ( var uri in sitemap) {
        var rr = route['ALL'] || route[uri] || false;
        if (!rr || (!rr.disallow && !rr.hide)) {
            data += '<url>';
            data += '<loc>';
            data += this.my.url;
            data += uri;
            data += '</loc>';
            if (rr) {
                if (temp = rr.lastmod) {
                    data += '<lastmod>';
                    data += temp;
                    data += '</lastmod>';
                }
                if (temp = rr.changefreq) {
                    data += '<changefreq>';
                    data += temp;
                    data += '</changefreq>';
                }
                if (temp = rr.priority) {
                    data += '<priority>';
                    data += temp;
                    data += '</priority>';
                }
            }
            data += '</url>';
        }
    }
    data += '</urlset>';
    return data;
};
/**
 * create robots.txt from sitemap
 * 
 * @function robots
 * @return {String}
 */
SITEMAP.prototype.robots = function() {

    var temp = true;
    var route = this.my.route;
    var sitemap = this.map;
    var data = 'User-agent: *\n';
    for ( var uri in sitemap) {
        var rr = route[uri];
        if (route['ALL'] && route['ALL'].disallow && !route['ALL'].hide) {
            temp = false;
            data += 'Disallow: /\n';
            break;
        } else if (rr && rr.disallow && !rr.hide) {
            temp = false;
            data += 'Disallow: ';
            data += uri;
            data += '\n';
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
 */
SITEMAP.prototype.XMLtoFile = function() {

    return write(this.xml(), this.my.sitemap);
};
/**
 * alias for write robots.txt to file
 * 
 * @function TXTtoFile
 */
SITEMAP.prototype.TXTtoFile = function() {

    return write(this.robots(), this.my.robots);
};
/**
 * alias for write both to files
 * 
 * @function toFile
 */
SITEMAP.prototype.toFile = function() {

    write(this.xml(), this.my.sitemap);
    write(this.robots(), this.my.robots);
    return;
};
/**
 * alias for stream sitemap to web
 * 
 * @function XMLtoWeb
 * @param {Object} res - response to client
 */
SITEMAP.prototype.XMLtoWeb = function(res) {

    return stream(this.xml(), res, 'application/xml');
};
/**
 * alias for stream robots.txt to web
 * 
 * @function TXTtoWeb
 * @param {Object} res - response to client
 */
SITEMAP.prototype.TXTtoWeb = function(res) {

    return stream(this.robots(), res, 'text/plain');
};
