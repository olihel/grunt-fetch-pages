/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

var FILE_ORIGINAL = 'test/www-root/index.html';
var FILE_FETCHED = 'test/www-fetched/index.html';
var FILE_FETCHED_EXPANDED = 'test/www-fetched/expanded.html';
var FILE_FETCHED_NOTEXPANDED = 'test/www-fetched/not-expanded.html';
var URL_ORIGINAL = 'test/www-root/url.html';
var URL_FETCHED = 'test/www-fetched/url.html';

var fs = require('fs');

exports.fetchpages = {
  checkFilesExist: function (test) {
    test.expect(6);
    test.ok(fs.existsSync(FILE_ORIGINAL), 'original file exists');
    test.ok(fs.existsSync(FILE_FETCHED), 'fetched file exists');
    test.ok(fs.existsSync(FILE_FETCHED_EXPANDED), 'fetched file exists');
    test.ok(fs.existsSync(FILE_FETCHED_NOTEXPANDED), 'fetched file exists');
    test.ok(fs.existsSync(URL_ORIGINAL), 'original URL file exists');
    test.ok(fs.existsSync(URL_FETCHED), 'fetched URL file exists');
    test.done();
  },

  checkFilesContent: function (test) {
    var contentOriginal, contentFetched;

    test.expect(3);

    try {
      contentOriginal = fs.readFileSync(FILE_ORIGINAL, 'utf8');
      contentFetched = fs.readFileSync(FILE_FETCHED, 'utf8');
    } catch (e) {
      console.log('ERROR: ', e);
    }

    test.ok(typeof contentOriginal !== 'undefined', 'original file content read');
    test.ok(typeof contentFetched !== 'undefined', 'fetched file content read');

    test.ok(contentOriginal === contentFetched, 'file contents match');

    test.done();
  }
};
