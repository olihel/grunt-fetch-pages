/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

module.exports = function (grunt) {
  'use strict';

  var fs = require('fs');
  var path = require('path');


  var removeDuplicates = function (array) {
    var i, j;
    for (i = 0; i < array.length; ++i) {
      for (j = i + 1; j < array.length; ++j) {
        if (JSON.stringify(array[i]) === JSON.stringify(array[j])) {
          array.splice(j--, 1);
        }
      }
    }
    return array;
  };


  var getPagesFromFiles = function (files, baseURL) {
    var pages = [];

    files.forEach(function (file) {
      file.src.forEach(function (src) {
        var local = file.dest;
        src = src.split(file.orig.cwd).join('');
        if (!file.orig.expand) {
          local = local + '/' + src;
        }
        pages.push({
          local: path.normalize(local),
          remote: baseURL + src
        });
      });
    });

    return pages;
  };

  var getPagesFromURLs = function (urls, target) {
    var pages = [];

    urls.forEach(function (urlObj) {
      var slash = ((target.charAt(target.length - 1) !== '/') && (urlObj.localFile.charAt(urlObj.localFile.length - 1) !== '/')) ? '/' : '';
      var local = target + slash + urlObj.localFile;
      pages.push({
        local: path.normalize(local),
        remote: urlObj.url
      });
    });

    return pages;
  };

  grunt.registerMultiTask('fetchpages', 'Fetch URLs and save the result as local files', function () {
    var request = require('request');

    var done = this.async();
    var options = this.options({
      'target': '',
      'urls': []
    });

    if (this.files && this.files.length) {
      if ((typeof options.baseURL === 'undefined') || (options.baseURL === '')) {
        grunt.log.error('"baseURL" option is mandatory when files feature is used!');
        done(false);
      }

      if (options.baseURL.substr(options.baseURL.length - 1) !== '/') {
        options.baseURL += '/';
      }
    }

    if ((options.target !== '') && (options.target.substr(options.target.length - 1) !== '/')) {
      options.target += '/';
    }

    var filesPages = getPagesFromFiles(this.files, options.baseURL);
    var urlsPages = getPagesFromURLs(options.urls, options.target);
    var pages = removeDuplicates(filesPages.concat(urlsPages));

    grunt.verbose.writeln('Creating folders...');
    pages.forEach(function (page) {
      var fileIndex = page.local.lastIndexOf('/');
      if (fileIndex !== -1) {
        var path = page.local.substr(0, fileIndex);
        if (!fs.existsSync(path)) {
          console.log('  ', path);
          fs.mkdirSync(path);
        }
      }
    });


    grunt.verbose.writeln('Fetching pages...');
    var pagesFetched = 0;
    pages.forEach(function (page) {
      request(page.remote, function (error, response, body) {
        grunt.verbose.writeln('  ' + page.remote + ' -> ' + page.local);
        if (!error && (response.statusCode === 200)) {
          grunt.verbose.writeln('  -> ' + body.length + ' Bytes');
          fs.writeFileSync(page.local, body);
          ++pagesFetched;
          if (pagesFetched === pages.length) {
            done();
          }
        } else {
          response && grunt.log.error('Response error, statusCode=', response.statusCode);
          error && grunt.log.error(error);
          response && response.body && grunt.log.error(response.body);
          done(false);
        }
      });
    });
  });
};
