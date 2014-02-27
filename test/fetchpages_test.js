/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

var FILE_ORIGINAL = 'test/www-root/index.html';
var FILE_FETCHED = 'test/www-fetched/index.html';
var FILE_FETCHED_EXPANDED = 'test/www-fetched/expanded.html';
var FILE_FETCHED_NOTEXPANDED = 'test/www-fetched/not-expanded.html';
var URL_ORIGINAL = 'test/www-root/url.html';
var URL_FETCHED = 'test/www-fetched/url.html';
var FILES_FETCHED_FOLLOWEDLINKS = [
  'test/www-fetched/parsedlink1.html',
  'test/www-fetched/parsedlink2-datalocalfile.html',
  'test/www-fetched/parsedlink3.html',
  'test/www-fetched/sub/parsedlink4.html',
];
var FILES_FETCHED_FOLLOWEDLINKS_IGNORED = 'test/www-fetched/parsedlink-ignored.html';
var FILE_DUPLICATE_IGNORED = 'test/www-fetched/index-duplicate.html';
var FILE_ORIGINAL_CLEANED = 'test/www-root/clean-cleaned.html';
var FILE_FETCHED_CLEANED = 'test/www-fetched/clean.html';

var fs = require('fs');

exports.fetchpages = {
  checkIndexFilesExist: function (test) {
    test.expect(2);
    test.ok(fs.existsSync(FILE_ORIGINAL), 'original file exists');
    test.ok(fs.existsSync(FILE_FETCHED), 'fetched file exists');
    test.done();
  },

  checkFilesFromURLsExist: function (test) {
    test.expect(2);
    test.ok(fs.existsSync(URL_ORIGINAL), 'original URL file exists');
    test.ok(fs.existsSync(URL_FETCHED), 'fetched URL file exists');
    test.done();
  },

  checkExpandedFilesExist: function (test) {
    test.expect(2);
    test.ok(fs.existsSync(FILE_FETCHED_EXPANDED), 'fetched file exists');
    test.ok(fs.existsSync(FILE_FETCHED_NOTEXPANDED), 'fetched file exists');
    test.done();
  },

  checkFollowedLinksFilesExist: function (test) {
    test.expect(FILES_FETCHED_FOLLOWEDLINKS.length);
    FILES_FETCHED_FOLLOWEDLINKS.forEach(function (file, index) {
      test.ok(fs.existsSync(file), 'followed link #' + (index + 1) + ' file exists');
    });
    test.done();
  },

  checkFollowedLinksIgnoredFilesDontExist: function (test) {
    test.expect(1);
    test.ok(!fs.existsSync(FILES_FETCHED_FOLLOWEDLINKS_IGNORED), 'followed link ignored file does not exist');
    test.done();
  },

  checkDuplicateFileDoesntExist: function (test) {
    test.expect(1);
    test.ok(!fs.existsSync(FILE_DUPLICATE_IGNORED), 'duplicate file does not exist');
    test.done();
  },

  checkCleanedFileExists: function (test) {
    test.expect(1);
    test.ok(fs.existsSync(FILE_FETCHED_CLEANED), 'cleaned file exists');
    test.done();
  },

  checkIndexFilesContent: function (test) {
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
  },

  checkCleanedFileContent: function (test) {
    var contentOriginal, contentFetched;

    test.expect(3);

    try {
      contentOriginal = fs.readFileSync(FILE_ORIGINAL_CLEANED, 'utf8');
      contentFetched = fs.readFileSync(FILE_FETCHED_CLEANED, 'utf8');
    } catch (e) {
      console.log('ERROR: ', e);
    }

    test.ok(typeof contentOriginal !== 'undefined', 'original file content read');
    test.ok(typeof contentFetched !== 'undefined', 'fetched file content read');

    test.ok(contentOriginal === contentFetched, 'file contents match');

    test.done();
  }
};
