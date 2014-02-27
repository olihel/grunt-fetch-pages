# grunt-fetch-pages [![NPM Version](https://badge.fury.io/js/grunt-fetch-pages.png)](http://badge.fury.io/js/grunt-fetch-pages) [![Dependency Status](https://gemnasium.com/olihel/grunt-fetch-pages.png)](https://gemnasium.com/olihel/grunt-fetch-pages) [![Build Status](https://travis-ci.org/olihel/grunt-fetch-pages.png?branch=master)](https://travis-ci.org/olihel/grunt-fetch-pages)

> Grunt plugin for fetching URLs and saving the result as local files.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fetch-pages --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fetch-pages');
```

## The "fetchpages" task

### Overview
In your project's Gruntfile, add a section named `fetchpages` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  fetchpages: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### baseURL
Type: `String`  

Base url for fetching remote pages via GruntJS "files" feature. Can be omitted when using only the `urls` feature (see `urls` option). 

#### destinationFolder
Type: `String`  
Required: yes

Local destination folder for fetched remote urls. This option is mandatory.

#### urls
Type: `Array`  
Default: `[]`

An optional list of remote urls to fetch. Required properties per element:  
- `url`: full remote URL to fetch  
- `localFile`: local file name for fetched page (destination folder is defined by `urlsDest` option)

#### followLinks
Type: `Boolean`  
Default: `true`

Also fetch sub pages referenced via links (`<a href="">`). No fetching of links within sub pages at this time.

#### ignoreSelector
Type: `String`  
Default: `[rel="nofollow"]`

Selector for ignoring certain links when following (see `followLinks` option). The default value matches links with the "rel" attribute set to "nofollow": `<a href="" rel="nofollow">`.  
The selector is applied as `$('a:not(ignoreSelector)')`, e.g. `$('a:not([rel="nofollow"])')`

#### cleanHTML
Type: `Boolean`  
Default: `false`

Clean fetched pages via [htmlclean](https://github.com/anseki/htmlclean) node module, removing unneeded whitespaces, line-breaks, comments, etc.

### Usage Examples

Simple example, fetch base URL and follow links:

```js
grunt.initConfig({
  fetchpages: {
    dist: {
      options: {
        baseURL: 'http://localhost:3000',
        destinationFolder: 'test/www-fetched',
      }
    }
  }
});
```

Full example with all feasible options set:

```js
grunt.initConfig({
  fetchpages: {
    dist: {
      options: {
        baseURL: 'http://localhost:3000',
        destinationFolder: 'test/www-fetched',
        urls: [
          {url: 'http://localhost:3003/url.html', localFile: 'url.html'}
        ],
        followLinks: true,
        ignoreSelector: '[rel="nofollow"]',
        cleanHTML: false
      },
      files: [
        {
          src: ['**/*.html', '!url.html'],
          expand: true,
          cwd: 'test/www-root/'
        }
      ]
    }
  }
});
```

## Contributing
Take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Do not submit code that did not pass the default grunt task for linting and testing.

[![githalytics.com alpha](https://cruel-carlota.gopagoda.com/969b888541f7d6ce883776737ae69ed8 "githalytics.com")](http://githalytics.com/olihel/grunt-fetch-pages)

<sub>**Credits**</sub>  
<sub>Thanks to [SinnerSchrader](http://www.sinnerschrader.com/) for support.</sub>

<sub>**License**</sub>  
<sub>The MIT License (MIT)</sub>  
<sub>Copyright (c) 2013-2014 Oliver Hellebusch</sub>

<sub>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</sub>

<sub>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</sub>

<sub>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</sub>

