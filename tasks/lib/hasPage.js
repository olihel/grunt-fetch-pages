/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

module.exports = function hasPage(page, pages) {
  var len = pages.length;

  for (var i = 0; i < len; i++) {
    if ((pages[i].local === page.local) || (pages[i].remote === page.remote)) {
      return true;
    }
  }
  
  return false;
};
