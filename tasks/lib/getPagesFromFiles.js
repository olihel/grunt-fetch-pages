/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2016 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

var path = require('path');
var url = require('url');

module.exports = function getPagesFromFiles(files, baseURL, destinationFolder) {
  var pages = [];

  files.forEach(function (file) {
    file.src.forEach(function (src) {
      var local = destinationFolder;
      src = src.split(file.orig.cwd).join('');
      local = local + '/' + src;
      pages.push({
        local: path.normalize(local),
        remote: url.resolve(baseURL, src)
      });
    });
  });

  return pages;
};
