/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

module.exports = function (grunt) {
  'use strict';

  var fs = require('fs');


  var createFilePathIfNotExistent = function (file) {
    var fileIndex = file.lastIndexOf('/');
    if (fileIndex !== -1) {
      var path = file.substr(0, fileIndex);
      fs.existsSync(path) || fs.mkdirSync(path);
    }
  };


  var getPagesFromFiles = function (files, baseURL, target) {
    var pages = [];

    files.forEach(function (filePair) {
      var isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function (src) {
        var local;
        var remote;
        if (isExpandedPair) {
          local = src.substr(filePair.orig.cwd.length);
          remote = baseURL + filePair.dest;
        } else {
          local = src;
          remote = baseURL + filePair.dest + src;
        }

        local = target + local;

        pages.push({
          local: local,
          remote: remote
        });
      });
    });

    return pages;
  };


  grunt.registerMultiTask('fetchpages', 'Fetch URLs and save the result as local files', function () {
    var request = require('request');

    var done = this.async();
    var options = this.options({
      'target': ''
    });

    if ((typeof options.baseURL === 'undefined') || (options.baseURL === '')) {
      grunt.log.error('"baseURL" option is mandatory!');
      return false;
    }

    if (options.baseURL.substr(options.baseURL.length - 1) !== '/') {
      options.baseURL += '/';
    }

    if ((options.target !== '') && (options.target.substr(options.target.length - 1) !== '/')) {
      options.target += '/';
    }

    var pages = getPagesFromFiles(this.files, options.baseURL, options.target);
    var pagesFetched = 0;
    pages.forEach(function (page) {
      request(page.remote, function (error, response, body) {
        grunt.verbose.writeln(page.remote + ' -> ' + page.local);
        if (!error && (response.statusCode === 200)) {
          createFilePathIfNotExistent(page.local);
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
