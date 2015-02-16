/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2015 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

var path = require('path');

module.exports = function getPagesFromURLs(destinationFolder, urls) {
  var pages = [];

  urls.forEach(function (urlObj) {
    var local = destinationFolder + urlObj.localFile;
    pages.push({
      local: path.normalize(local),
      remote: urlObj.url
    });
  });

  return pages;
};
