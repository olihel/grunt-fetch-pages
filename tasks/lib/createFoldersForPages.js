/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2015 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function createFoldersForPages(pages) {
  console.log('Creating folders...');

  pages.forEach(function (page) {
    var fileIndex;
    if (page.local) {
      fileIndex = page.local.lastIndexOf('/');
      if (fileIndex !== -1) {
        var path = page.local.substr(0, fileIndex);
        if (!fs.existsSync(path)) {
          console.log('  ', path);
          mkdirp.sync(path);
        }
      }
    }
  });
};
