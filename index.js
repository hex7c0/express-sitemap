"use strict";
/**
 * @file express-sitemap main
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage main
 * @version 1.2.2
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var FS = require('fs');
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
 * @return
 */
function write(data,file) {

    return FS.writeFile(file,data,function(err) {

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
 * @return
 */
function stream(data,res,header) {

    var re = res.res || res;
    re.header('Content-Type',header);
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

    options = options || {};
    var http = options.http == 'https' ? 'https://' : 'http://';
    var url = String(options.url || '127.0.0.1');
    var port = Number(options.port) ? ':' + Number(options.port) : '';
    this.my = {
        url: http + url + port,
        sitemap: String(options.sitemap || 'sitemap.xml'),
        robots: String(options.robots || 'robots.txt'),
        route: typeof (options.route) == 'object' ? options.route : Object
                .create(null),
    };
    this.map = typeof (options.map) == 'object' ? options.map : Object
            .create(null);
    if (options.generate && options.generate._router) {
        this.generate(options.generate);
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
                that[path] = ['get'];
            }
            // if (that[path] == undefined) {
            // that[path] = [];
            // }
            // for ( var name in route.methods) {
            // if (that[path].indexOf(name) < 0) {
            // that[path].push(name);
            // }
            // }
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
 * @return
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
 * @return
 */
SITEMAP.prototype.XMLtoFile = function() {

    return write(this.xml(),this.my.sitemap);
};
/**
 * alias for write robots.txt to file
 * 
 * @function TXTtoFile
 * @return
 */
SITEMAP.prototype.TXTtoFile = function() {

    return write(this.robots(),this.my.robots);
};
/**
 * alias for write both to files
 * 
 * @function toFile
 * @return
 */
SITEMAP.prototype.toFile = function() {

    write(this.xml(),this.my.sitemap);
    write(this.robots(),this.my.robots);
    return;
};
/**
 * alias for stream sitemap to web
 * 
 * @function XMLtoWeb
 * @param {Object} res - response to client
 * @return
 */
SITEMAP.prototype.XMLtoWeb = function(res) {

    return stream(this.xml(),res,'application/xml');
};
/**
 * alias for stream robots.txt to web
 * 
 * @function TXTtoWeb
 * @param {Object} res - response to client
 * @return
 */
SITEMAP.prototype.TXTtoWeb = function(res) {

    return stream(this.robots(),res,'text/plain');
};
