"use strict";
/**
 * @file express-sitemap main
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage main
 * @version 1.1.0
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
 * @return {Boolean}
 */
function write(data,file) {

    return FS.writeFile(file,data,function(err) {

        if (err) {
            return false;
        }
        return true;
    });
}
/**
 * stream data to web
 * 
 * @function stream
 * @param {String} data - created xml or robots.txt
 * @param {Object} res - response to client
 * @return
 */
function stream(data,res) {

    res.send(data);
    return;
}

/*
 * class
 */
/**
 * export class
 * 
 * @exports sitemap
 */
module.exports = function(options) {

    return new sitemap(options);
};
/**
 * sitemap class
 * 
 * @class sitemap
 * @param {Object} options - various options. Check README.md
 * @return {Object}
 */
function sitemap(options) {

    options = options || {};
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
 * generate sitemap object
 * 
 * @function generate
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
 * generate sitemap object with tickle
 * 
 * @function tickle
 * @return {Object}
 */
sitemap.prototype.tickle = function() {

    if (GLOBAL.tickle && GLOBAL.tickle.route) {
        var that = this.sitemap;
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
sitemap.prototype.reset = function() {

    this.sitemap = Object.create(null);
    return;
};
/**
 * create xml from sitemap
 * 
 * @function xml
 * @return {String}
 */
sitemap.prototype.xml = function() {

    var temp = null;
    var route = this.my.route;
    var sitemap = this.sitemap;
    var data = '<?xml version="1.0" encoding="UTF-8"?>';
    data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for ( var uri in sitemap) {
        var rr = route[uri] || route['ALL'] || false;
        if (!rr || !rr.disallow) {
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
sitemap.prototype.robots = function() {

    var temp = 0;
    var route = this.my.route;
    var sitemap = this.sitemap;
    var data = 'User-agent: *\n';
    for ( var uri in sitemap) {
        if (route['ALL'] && route['ALL'].disallow) {
            temp++;
            data += 'Disallow: /\n';
            break;
        } else if (route[uri] && route[uri].disallow) {
            temp++;
            data += 'Disallow: ';
            data += uri;
            data += '\n';
        }
    }
    if (temp == 0) {
        data += 'Disallow: \n';
    }
    return data;
};
/**
 * alias for write sitemap to file
 * 
 * @function XMLtoFile
 * @return {Boolean}
 */
sitemap.prototype.XMLtoFile = function() {

    return write(this.xml(),this.my.file);
};
/**
 * alias for write robots.txt to file
 * 
 * @function TXTtoFile
 * @return {Boolean}
 */
sitemap.prototype.TXTtoFile = function() {

    return write(this.robots(),'robots.txt');
};
/**
 * alias for write both to files
 * 
 * @function toFile
 * @return {Boolean}
 */
sitemap.prototype.toFile = function() {

    return write(this.xml(),this.my.file) && write(this.robots(),'robots.txt');
};
/**
 * alias for stream sitemap to web
 * 
 * @function XMLtoWeb
 * @param {Object} res - response to client
 * @return
 */
sitemap.prototype.XMLtoWeb = function(res) {

    res.header('Content-Type','application/xml');
    return stream(this.xml(),res);
};
/**
 * alias for stream robots.txt to web
 * 
 * @function TXTtoWeb
 * @param {Object} res - response to client
 * @return
 */
sitemap.prototype.TXTtoWeb = function(res) {

    res.header('Content-Type','text/plain');
    return stream(this.robots(),res);
};
