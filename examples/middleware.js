"use strict";
/**
 * @file middleware example
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
    var sitemap = require('../index.min.js'); // use require('express-sitemap') instead
    var express = require('express');
    var father = express();
    var child = express();
    var tickle = require('tickle');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

child.use(tickle);
// express routing
child.get('/',function(req,res) {

    res.send('hello /');
});

child.get('/admin',function(req,res) {

    res.send('hello /admin');
});
child.post('/admin',function(req,res) {

    res.send('hello /admin');
});

child.get('/duplicate',function(req,res) {

    res.send('hello /duplicate');
}).get('/duplicate/:id',function(req,res) {

    res.send('hello /duplicate');
});

child.post('/foo',function(req,res) {

    res.send('hello /foo');
});

child.put('/nooo',function(req,res) {

    res.send('hello /nooo');
});

child.all('/all',function(req,res) {

    res.send('hello /all');
});

/*
 * try now :)
 */
child.get('/sitemap.xml',function(req,res) {

    sitemap.tickle();
    sitemap.XMLtoWeb(res);
});

// server starting
father.use(child);
father.listen(3000);
console.log('starting "hello world" on port 3000');

/*
 * sitemap
 * 
 * @todo not work http://expressjs.com/4x/api.html#app.use
 */
sitemap = sitemap();
console.log('Father');
console.log(sitemap.generate(father));
sitemap.reset();
console.log('Child');
console.log(sitemap.generate(child));
sitemap.reset();
