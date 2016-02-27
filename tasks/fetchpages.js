/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2016 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

module.exports = function (grunt) {
  'use strict';

  var fetchPages = require('./lib/fetchPages');
  var getPagesFromFiles = require('./lib/getPagesFromFiles');
  var getPagesFromURLs = require('./lib/getPagesFromURLs');

  var url = require('url');

  grunt.registerMultiTask('fetchpages', 'Fetch URLs and save the result as local files', function () {
    var done = this.async();
    var pages = [];
    var options = this.options({
      'urls': [],
      'followLinks': true,
      'ignoreSelector': '[rel="nofollow"]',
      'cleanHTML': false,
      'fetchBaseURL': true
    });

    var destinationFolder = options.destinationFolder;
    var baseURL = options.baseURL;
    var urls = options.urls;
    var followLinks = options.followLinks;
    var ignoreSelector = options.ignoreSelector;
    var cleanHTML = options.cleanHTML;
    var fetchBaseURL = options.fetchBaseURL;

    if (!destinationFolder) {
      grunt.log.error('"destinationFolder" option is mandatory!');
      done(false);
    }

    if (this.files && this.files.length) {
      if ((typeof baseURL === 'undefined') || (baseURL === '')) {
        grunt.log.error('"baseURL" option is mandatory when "files" feature is used!');
        done(false);
      }
    }

    // ensure that destinationFolder path ends with a slash
    if (destinationFolder && destinationFolder.substr(destinationFolder.length - 1) !== '/') {
      destinationFolder += '/';
    }

    if (baseURL && fetchBaseURL) {
      var parsedBaseURL = url.parse(baseURL);
      urls.push({
        localFile: parsedBaseURL.pathname === '/' ? 'index.html' : parsedBaseURL.pathname,
        url: parsedBaseURL.href
      });
    }

    // baseURL is needed in the followLinks branch, so stop if followLinks is true but not baseURL ist set
    if (followLinks && !baseURL) {
      grunt.log.error('baseURL is mandatory if followLinks is true. Either set followLinks to false or define baseURL.');
      done(false);
      return;
    }

    pages = getPagesFromFiles(this.files, baseURL, destinationFolder);
    pages = pages.concat(getPagesFromURLs(destinationFolder, urls));
    fetchPages(pages, done, baseURL, destinationFolder, followLinks, ignoreSelector, cleanHTML);
  });
};
