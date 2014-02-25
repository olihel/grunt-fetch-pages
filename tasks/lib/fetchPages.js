/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

var fs = require('fs');
var request = require('request');
var jsdom = require('jsdom');
var url = require('url');
var removeDuplicates = require('./removeDuplicates');
var createFoldersForPages = require('./createFoldersForPages');
var hasPage = require('./hasPage');

module.exports = function fetchPages(pages, done, baseURL, destinationFolder, followLinks, ignoreSelector) {
  var pagesFetched = 0;
  var followPages = [];

  console.log('Fetching pages...');

  pages = removeDuplicates(pages);
  createFoldersForPages(pages);

  pages.forEach(function (page) {
    request(page.remote, function (error, response, body) {
      console.log('  ' + page.remote + ' -> ' + page.local);
      if (!error && (response.statusCode === 200)) {
        console.log('  -> ' + body.length + ' Bytes');
        fs.writeFileSync(page.local, body);

        if (followLinks) {
          jsdom.env(
            body,
            [require.resolve('jquery')],
            function (errors, window) {
              window.$('a:not(' + ignoreSelector + ')').each(function () {
                var $this = window.$(this);
                var href = $this.attr('href');
                var localFile = $this.data('localfile') || url.parse(href).pathname;
                if (!localFile) {
                  console.warn('skipping url with invalid pathname (' + href + ')');
                  return;
                }
                var remoteURL = baseURL + href;
                var newPage = {
                  local: destinationFolder + localFile,
                  remote: remoteURL
                };
                if (hasPage(newPage, pages)) {
                  console.warn('skipping duplicate page ' + JSON.stringify(newPage));
                } else {
                  followPages.push(newPage);
                }
              });
              ++pagesFetched;
              if (pagesFetched === pages.length) {
                if (followPages.length) {
                  console.log('Following links...');
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
        response && console.error('Response error, statusCode=', response.statusCode);
        error && console.error(error);
        response && response.body && console.error(response.body);
        done(false);
      }
    });
  });
};
