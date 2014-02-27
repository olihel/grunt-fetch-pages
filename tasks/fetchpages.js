/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
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
      'cleanHTML': false
    });

    var destinationFolder = options.destinationFolder;
    var baseURL = options.baseURL;
    var urls = options.urls;
    var followLinks = options.followLinks;
    var ignoreSelector = options.ignoreSelector;
    var cleanHTML = options.cleanHTML;

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

    if (baseURL) {
      var pathname = url.parse(baseURL).pathname;
      urls.push({
        localFile: pathname === '/' ? 'index.html' : pathname,
        url: baseURL
      });
    }

    pages = getPagesFromFiles(this.files, baseURL, destinationFolder);
    pages = pages.concat(getPagesFromURLs(destinationFolder, urls));
    fetchPages(pages, done, baseURL, destinationFolder, followLinks, ignoreSelector, cleanHTML);
  });
};
