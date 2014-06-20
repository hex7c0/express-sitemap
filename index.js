"use strict";
/**
 * @file express-sitemap main
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage main
 * @version 1.0.1
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
 * create xml from sitemap
 * 
 * @function xml
 * @return {Object}
 */
sitemap.prototype.xml = function() {

    var temp = null;
    var route = this.my.route;
    var data = '<?xml version="1.0" encoding="UTF-8"?>';
    data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for ( var uri in this.sitemap) {
        var rr = route[uri] || route['ALL'] || false;
        data += '<url>';
        // loc
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
    data += '</urlset>';
    return data;
};
/**
 * write sitemap to file
 * 
 * @function write
 * @param {String} data - created xml
 * @return {Boolean}
 */
sitemap.prototype.write = function(data) {

    return FS.writeFile(this.my.file,data,function(err) {

        if (err) {
            return false;
        }
        return true;
    });
};
/**
 * alis for write sitemap to file
 * 
 * @function toFile
 * @return {Boolean}
 */
sitemap.prototype.toFile = function() {

    return this.write(this.xml());
};
/**
 * stream sitemap to web
 * 
 * @function web
 * @param {String} data - created xml
 * @param {Object} res - response to client
 * @return
 */
sitemap.prototype.stream = function(data,res) {

    res.header('Content-Type','application/xml');
    res.send(data);
    return;
};
/**
 * alis for stream sitemap to web
 * 
 * @function toFile
 * @param {Object} res - response to client
 * @return
 */
sitemap.prototype.toWeb = function(res) {

    return this.stream(this.xml(),res);
};
/**
 * generate sitemap
 * 
 * @function write
 * @param {Object} app - express app
 * @return {Object}
 */
sitemap.prototype.generate = function(app) {

    var that = this.sitemap;
    var routing = app._router.stack;
    for (var i = 0, il = routing.length; i < il; i++) {
        var route = routing[i].route;
        if (route) {
            var path = route.path;
            if (that[path] == undefined) {
                that[path] = [];
            }
            for ( var name in route.methods) {
                if (that[path].indexOf(name) < 0) {
                    that[path].push(name);
                }
            }
        }
    }
    return that;
};
/**
 * reset
 * 
 * @function reset
 * @return
 */
sitemap.prototype.reset = function() {

    this.sitemap = Object.create(null);
    return;
};
/**
 * sitemap class
 * 
 * @class sitemap
 * @param {Object} options - various options. Check README.md
 * @return {Object}
 */
function sitemap(options) {

    var options = options || {};
    var http = options.http == 'https' ? 'https://' : 'http://';
    var url = String(options.url || '127.0.0.1');
    var port = Number(options.port) ? ':' + Number(options.port) : '';
    this.my = {
        file: String(options.file || 'sitemap.xml'),
        url: http + url + port,
        robots: Boolean(options.robots),
        route: typeof (options.route) == 'object' ? options.route : Object.create(null),
    };
    this.sitemap = typeof (options.sitemap) == 'object' ? options.sitemap : Object.create(null);
    if (options.generate && options.generate._router) {
        this.generate(options.generate);
    }
    return;
}
/**
 * export class
 * 
 * @exports sitemap
 */
module.exports = function(options) {

    return new sitemap(options);
};
