/*!
 * grunt-fetch-pages
 * https://github.com/olihel/grunt-fetch-pages.git
 *
 * Copyright (c) 2013-2014 Oliver Hellebusch
 * Released under MIT license (https://raw.github.com/olihel/grunt-fetch-pages/master/LICENSE-MIT)
 */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.test %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      test: ['test/subdir/']
    },

    express: {
      test: {
        options: {
          hostname: 'localhost',
          port: 3003,
          bases: 'test/www-root'
        }
      }
    },

    fetchpages: {
      noclean: {
        options: {
          baseURL: 'http://localhost:<%= express.test.options.port %>',
          destinationFolder: 'test/subdir/www-fetched',
          urls: [
            {url: 'http://localhost:<%= express.test.options.port %>/url.html', localFile: 'url.html'}
          ],
          followLinks: true,
          ignoreSelector: '[rel="nofollow"]',
          cleanHTML: false,
          fetchBaseURL: true
        },
        files: [
          {
            src: ['**/*.html', '!url.html', '!not-expanded.html', '!**/parsedlink*.html', '!clean.html', '!clean-cleaned.html', '!index.html'],
            expand: true,
            cwd: 'test/www-root/'
          },
          {
            src: ['not-expanded.html'],
            expand: false,
            cwd: 'test/www-root/'
          }
        ]
      },

      clean: {
        options: {
          baseURL: 'http://localhost:<%= express.test.options.port %>/clean.html',
          destinationFolder: 'test/subdir/www-fetched',
          followLinks: false,
          cleanHTML: true
        }
      }
    },

    nodeunit: {
      test: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'express', 'fetchpages', 'nodeunit']);
};
