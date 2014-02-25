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
  var url = require('url');

  var removeDuplicates = function (pages) {
    var i, j;
    for (i = 0; i < pages.length; ++i) {
      for (j = i + 1; j < pages.length; ++j) {
        if ((pages[i].local === pages[j].local) || (pages[i].remote === pages[j].remote)) {
          grunt.log.warn('skipping duplicate page ' + JSON.stringify(pages[j]));
          pages.splice(j--, 1);
        }
      }
    }
    return pages;
  };

  var hasPage = function (page, pages) {
    var len = pages.length;
    for (var i = 0; i < len; i++) {
      if ((pages[i].local === page.local) || (pages[i].remote === page.remote)) {
        return true;
      }
    }
    return false;
  };

  var getPagesFromFiles = function (files, options) {
    var pages = [];

    files.forEach(function (file) {
      file.src.forEach(function (src) {
        var local = options.destinationFolder;
        src = src.split(file.orig.cwd).join('');
        local = local + '/' + src;
        pages.push({
          local: path.normalize(local),
          remote: options.baseURL + src
        });
      });
    });

    return pages;
  };

  var getPagesFromURLs = function (options) {
    var pages = [];

    options.urls.forEach(function (urlObj) {
      var local = options.destinationFolder + urlObj.localFile;
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

          if (options.followLinks) {
            jsdom.env(
              body,
              [require.resolve('jquery')],
              function (errors, window) {
                window.$('a:not(' + options.ignoreSelector + ')').each(function () {
                  var $this = window.$(this);
                  var href = $this.attr('href');
                  var localFile = $this.data('localfile') || url.parse(href).pathname;
                  if (!localFile) {
                    grunt.log.warn('skipping url with invalid pathname (' + href + ')');
                    return;
                  }
                  var remoteURL = options.baseURL + href;
                  var newPage = {
                    local: options.destinationFolder + localFile,
                    remote: remoteURL
                  };
                  if (hasPage(newPage, pages)) {
                    grunt.log.warn('skipping duplicate page ' + JSON.stringify(newPage));
                  } else {
                    followPages.push(newPage);
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
    var pages = [];
    var options = this.options({
      'urls': [],
      'followLinks': true,
      'ignoreSelector': '[rel="nofollow"]'
    });

    if (!options.destinationFolder) {
      grunt.log.error('"destinationFolder" option is mandatory!');
      done(false);
    }

    if (this.files && this.files.length) {
      if ((typeof options.baseURL === 'undefined') || (options.baseURL === '')) {
        grunt.log.error('"baseURL" option is mandatory when "files" feature is used!');
        done(false);
      }
    }

    // ensure that baseURL ends with a slash
    if (options.baseURL && options.baseURL.substr(options.baseURL.length - 1) !== '/') {
      options.baseURL += '/';
    }

    // ensure that destinationFolder path ends with a slash
    if (options.destinationFolder && options.destinationFolder.substr(options.destinationFolder.length - 1) !== '/') {
      options.destinationFolder += '/';
    }

    if (options.baseURL) {
      var pathname = url.parse(options.baseURL).pathname;
      options.urls.push({
        localFile: pathname === '/' ? 'index.html' : pathname,
        url: options.baseURL
      });
    }

    pages = getPagesFromFiles(this.files, options);
    pages = pages.concat(getPagesFromURLs(options));
    fetchPages(pages, done, options);
  });
};
