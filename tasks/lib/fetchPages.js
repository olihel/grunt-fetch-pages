/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2016 Oliver Hellebusch
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
var htmlclean = require('htmlclean');

module.exports = function fetchPages(pages, done, baseURL, destinationFolder, followLinks, ignoreSelector, cleanHTML) {
  var pagesFetched = 0;
  var followPages = [];

  if ((!pages || (pages.length === 0)) && baseURL) {
    pages = [{
      local: null,
      remote: baseURL
    }];
  }

  console.log('Fetching pages...');

  pages = removeDuplicates(pages);
  createFoldersForPages(pages);

  pages.forEach(function (page) {
    request(page.remote, function (error, response, body) {
      console.log('  ' + page.remote + ' -> ' + page.local);
      if (!error && (response.statusCode === 200)) {
        console.log('  -> ' + body.length + ' Bytes');

        if (cleanHTML) {
          body = htmlclean(body);
        }

        if (page.local) {
          fs.writeFileSync(page.local, body);
        }

        if (followLinks) {
          if (!baseURL) {
              console.error('baseURL is mandatory if followLinks is true. Either set followLinks to false or define baseURL.');
              done(false);
          }
          jsdom.env(
            body,
            [require.resolve('jquery')],
            function (errors, window) {
              window.$('a:not(' + ignoreSelector + ')').each(function () {
                var $this = window.$(this);
                var href = $this.attr('href');
                if (!href) {
                  console.warn('following links: skipping link with missing href attribute (' + this.outerHTML + ')');
                  return;
                }
                var localFile = $this.data('localfile') || url.parse(href).pathname;
                if (!localFile) {
                  console.warn('skipping url with invalid pathname (' + href + ')');
                  return;
                }
                if (localFile.charAt(0) === '/') {
                  localFile = localFile.substr(1);
                }
                var remoteURL = url.resolve(baseURL, href);
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
