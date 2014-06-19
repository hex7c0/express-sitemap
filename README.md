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

reset sitemap
```js
sitemap.reset();
```

generate sitemap
```js
sitemap.generate(app);
```

write sitemap to file
```js
sitemap.write();
```

### sitemap(options)

 - `http` - **String** Website HTTP protocol (http|https) *(default "http")*
 - `url` - **String** Website URL *(default "127.0.0.1")*
 - `port` - **Number** Website Port *(default "80")*
 - `file` - **String** Name of your sitemap file *(default "sitemap.xml")*
 - `route` - **Object** Add extra information to sitemap related to this [documentation](http://www.sitemaps.org/protocol.html#xmlTagDefinitions) *(default "disabled")*
  - `lastmod` - **Date** Integrity not controlled
  - `changefreq` - **String** Integrity not controlled
  - `priority` - **Float** Integrity not controlled
 - `sitemap` - **Object** Force route detection and building *(default "disabled")*

#### Examples

Take a look at my [examples](https://github.com/hex7c0/express-sitemap/tree/master/examples)

Not working (for now) for middleware: http://expressjs.com/4x/api.html#app.use

## License
Copyright (c) 2014 hex7c0

Licensed under the GPLv3 license
