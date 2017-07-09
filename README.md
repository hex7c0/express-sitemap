# [express-sitemap](https://github.com/hex7c0/express-sitemap)

[![NPM version](https://img.shields.io/npm/v/express-sitemap.svg)](https://www.npmjs.com/package/express-sitemap)
[![Linux Status](https://img.shields.io/travis/hex7c0/express-sitemap.svg?label=linux-osx)](https://travis-ci.org/hex7c0/express-sitemap)
[![Windows Status](https://img.shields.io/appveyor/ci/hex7c0/express-sitemap.svg?label=windows)](https://ci.appveyor.com/project/hex7c0/express-sitemap)
[![Dependency Status](https://img.shields.io/david/hex7c0/express-sitemap.svg)](https://david-dm.org/hex7c0/express-sitemap)
[![Coveralls](https://img.shields.io/coveralls/hex7c0/express-sitemap.svg)](https://coveralls.io/r/hex7c0/express-sitemap)

Sitemap and Robots for [expressjs](http://expressjs.com/) 3 and 4

## Installation

Install through NPM

```bash
npm install express-sitemap
```
or
```bash
git clone git://github.com/hex7c0/express-sitemap.git
```

## API

inside expressjs project
```js
var sitemap = require('express-sitemap')();

var app = require('express')();

sitemap.generate(app);
```

### Methods

if you want generate your own url
```js
var sitemap = require('express-sitemap');

sitemap({
    map: {
        '/foo': ['get'],
        '/foo2': ['get','post'],
        '/admin': ['get'],
        '/backdoor': [],
    },
    route: {
        '/foo': {
            lastmod: '2014-06-20',
            changefreq: 'always',
            priority: 1.0,
        },
        '/admin': {
            disallow: true,
        },
        '/backdoor': {
            hide: true,
        },
    },
}).XMLtoFile();
```

and this will be sitemap.xml
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://127.0.0.1/foo</loc>
        <lastmod>2014-06-19</lastmod>
        <changefreq>always</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>http://127.0.0.1/foo2</loc>
    </url>
</urlset>
```

and this will be robots.txt
```txt
User-agent: *
Disallow: /admin
```

reset prototype Object for sitemap
```js
sitemap.reset();
```

generate sitemap (wrapper)
```js
sitemap.generate(app);
```

generate sitemap from express 4.x configuration. Add an array with Router path if you want use nested callback
```js
sitemap.generate4(app [, Router]);
```

generate sitemap from express 3.x configuration
```js
sitemap.generate3(app);
```

generate prototype Object for sitemap if you use middleware or dynamic building
```js
sitemap.tickle();
```

write sitemap Object to file (set pathname inside module configuration or like argument)
```js
sitemap.XMLtoFile([path]);
```

write robots.txt to file (set pathname inside module configuration or like argument)
```js
sitemap.TXTtoFile([path]);
```

write both to files
```js
sitemap.toFile();
```

stream sitemap to web
```js
sitemap.XMLtoWeb(res);
```

stream robots.txt to web
```js
sitemap.TXTtoWeb(res);
```

### sitemap(options)

#### options

 - `http` - **String** Website HTTP protocol (http | https) *(default "http")*
 - `cache` - **Integer** Enable cache integration, refresh map after this millisecond value *(default "false")*
 - `url` - **String** Website URL *(default "127.0.0.1")*
 - `port` - **Number** Website Port *(default "80")*
 - `sitemap` - **String** Name of sitemap file *(default "sitemap.xml")*
 - `robots` - **String** Name of robots file *(default "robots.txt")*
 - `sitemapSubmission` - **String** Set `Sitemap` absolute location into robots *(default "disable")*
 - `route` - **Object** Add extra information to sitemap related to this [documentation](http://www.sitemaps.org/protocol.html#xmlTagDefinitions) *(default "disabled")*
  - `lastmod` - **Date** Integrity not controlled
  - `changefreq` - **String** Integrity not controlled
  - `priority` - **Float** Integrity not controlled
  - `alternatepages` - **Array** Add alternate language pages related to this [documentation](https://support.google.com/webmasters/answer/2620865)
    - `rel` - **String** Integrity not controlled
    - `hreflang` - **String** Integrity not controlled
    - `href` - **String** Integrity not controlled
  - `allow` - **Boolean** Flag for "allow" this route from parsing, and save into `robots.txt` *(default "null")*
  - `disallow` - **Boolean** Flag for "disallow" this route from parsing, and save into `robots.txt` *(default "null")*
  - `hide` - **Boolean** Flag for hide this route from globally parsing (no .xml or .txt) *(default "false")*
 - `map` - **Object** Force route (<loc>) detection and building *(default "disabled")*
 - `hideByRegex` - **Array** Array of RegEx that remove routes from output *(default "disabled")*
 - `generate` - **Object** Fastly generate sitemap from express app *(default "disabled")*

you can use `route: {'ALL': {} }` if you want propagate extra information to all your urls

## Examples

Take a look at my [examples](examples)

### [License GPLv3](LICENSE)
