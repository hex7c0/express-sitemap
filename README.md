#express-sitemap [![Build Status](https://travis-ci.org/hex7c0/express-sitemap.svg?branch=master)](https://travis-ci.org/hex7c0/express-sitemap) [![NPM version](https://badge.fury.io/js/express-sitemap.svg)](http://badge.fury.io/js/express-sitemap)

sitemap for [expressjs](http://expressjs.com/) 4

## Installation

Install through NPM

```
npm install express-sitemap
```
or
```
git clone git://github.com/hex7c0/express-sitemap.git
```

## API

inside expressjs project
```js
var sitemap = require('express-sitemap')();
var app = require('express')();

sitemap.generate(app);
```

### methods

reset Object sitemap
```js
sitemap.reset();
```

generate prototype Object for sitemap
```js
sitemap.generate(app);
```

stream sitemap Object to web
```js
sitemap.toWeb(res);
```

write sitemap Object to file
```js
sitemap.toFile();
```

### sitemap(options)

 - `http` - **String** Website HTTP protocol (http|https) *(default "http")*
 - `url` - **String** Website URL *(default "127.0.0.1")*
 - `port` - **Number** Website Port *(default "80")*
 - `file` - **String** Name of your sitemap file *(default "sitemap.xml")*
 - `route` - **Object** Add extra information to sitemap related to this [documentation](http://www.sitemaps.org/protocol.html#xmlTagDefinitions) *(default "disabled")*
  - `disallow` - **Boolean** Flag for disallow this route from parsing *(default "false")*
  - `lastmod` - **Date** Integrity not controlled
  - `changefreq` - **String** Integrity not controlled
  - `priority` - **Float** Integrity not controlled
 - `sitemap` - **Object** Force route (<loc>) detection and building *(default "disabled")*
 - `generate` - **Object** Fastly generate sitemap from express app *(default "disabled")*
 - `robots` - **Boolean** Flag for build robots.txt file *(default "disabled")*

#### Examples

Take a look at my [examples](https://github.com/hex7c0/express-sitemap/tree/master/examples)

_Middleware not working (for now) http://expressjs.com/4x/api.html#app.use_

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license
