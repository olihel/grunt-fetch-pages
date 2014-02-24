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
  var request = require('request');
  var jsdom = require('jsdom');

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

  var hasRemoteURL = function (pages, url) {
    var len = pages.length;
    for (var i = 0; i < len; i++) {
      if (pages[i].remote === url) {
        return true;
      }
    }
    return false;
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

  var getPagesFromURLs = function (urls, dest) {
    var pages = [];

    urls.forEach(function (urlObj) {
      var slash = ((dest.charAt(dest.length - 1) !== '/') && (urlObj.localFile.charAt(urlObj.localFile.length - 1) !== '/')) ? '/' : '';
      var local = dest + slash + urlObj.localFile;
      pages.push({
        local: path.normalize(local),
        remote: urlObj.url
      });
    });

    return pages;
  };

  var createFoldersForPages = function (pages) {
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
  };

  var fetchPages = function (pages, done, options) {
    grunt.verbose.writeln('Fetching pages...');
    var pagesFetched = 0;
    var followPages = [];

    pages = removeDuplicates(pages);
    createFoldersForPages(pages);

    pages.forEach(function (page) {
      request(page.remote, function (error, response, body) {
        grunt.verbose.writeln('  ' + page.remote + ' -> ' + page.local);
        if (!error && (response.statusCode === 200)) {
          grunt.verbose.writeln('  -> ' + body.length + ' Bytes');
          fs.writeFileSync(page.local, body);

          if (options.followLinksSelector) {
            jsdom.env(
              body,
              [require.resolve('jquery')],
              function (errors, window) {
                window.$(options.followLinksSelector).each(function () {
                  var $this = window.$(this);
                  var href = $this.attr('href');
                  var localFile = $this.data('localfile') || href;
                  var url = options.baseURL + href;
                  if (!hasRemoteURL(pages, url)) {
                    followPages.push({
                      local: options.urlsDest + localFile,
                      remote: url
                    });
                  }
                });
                ++pagesFetched;
                if (pagesFetched === pages.length) {
                  if (followPages.length) {
                    grunt.verbose.writeln('Following links...');
                    fetchPages(followPages, done, {});
                  } else {
                    done();
                  }
                }
              }
            );
          } else {
            ++pagesFetched;
            if (pagesFetched === pages.length) {
              done();
            }
          }
        } else {
          response && grunt.log.error('Response error, statusCode=', response.statusCode);
          error && grunt.log.error(error);
          response && response.body && grunt.log.error(response.body);
          done(false);
        }
      });
    });
  };

  grunt.registerMultiTask('fetchpages', 'Fetch URLs and save the result as local files', function () {
    var done = this.async();
    var options = this.options({
      'urlsDest': '',
      'urls': []
    });

    if (this.files && this.files.length) {
      if ((typeof options.baseURL === 'undefined') || (options.baseURL === '')) {
        grunt.log.error('"baseURL" option is mandatory when "files" or "followLinksSelector" feature is used!');
        done(false);
      }

      if (options.baseURL.substr(options.baseURL.length - 1) !== '/') {
        options.baseURL += '/';
      }
    }

    if ((options.urlsDest !== '') && (options.urlsDest.substr(options.urlsDest.length - 1) !== '/')) {
      options.urlsDest += '/';
    }

    var filesPages = getPagesFromFiles(this.files, options.baseURL);
    var urlsPages = getPagesFromURLs(options.urls, options.urlsDest);
    fetchPages(filesPages.concat(urlsPages), done, options);
  });
};
