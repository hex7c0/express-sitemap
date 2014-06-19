"use strict";
/**
 * @file force example
 * @module express-sitemap
 * @package express-sitemap
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var sitemap = require('../index.js'); // use require('express-sitemap') instead
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * sitemap
 */
sitemap({
    file: 'force.xml',
    sitemap: {
        '/pippo': ['get'],
        '/pluto': ['get','post'],
    },
    route: {
        '/pippo': {
            lastmod: '2014-06-19',
            changefreq: 'always',
            priority: 1.0,
        },
    },
}).write();
