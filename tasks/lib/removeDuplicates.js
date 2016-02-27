/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2016 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

'use strict';

module.exports = function removeDuplicates(pages) {
  var i, j;

  for (i = 0; i < pages.length; ++i) {
    for (j = i + 1; j < pages.length; ++j) {
      if ((pages[i].local === pages[j].local) || (pages[i].remote === pages[j].remote)) {
        console.warn('skipping duplicate page ' + JSON.stringify(pages[j]));
        pages.splice(j--, 1);
      }
    }
  }

  return pages;
};
