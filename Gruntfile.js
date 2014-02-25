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
      test: ['test/www-fetched']
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
      test: {
        options: {
          baseURL: 'http://localhost:3003',
          urls: [
            {url: 'http://localhost:3003/url.html', localFile: 'url.html'}
          ],
          destinationFolder: 'test/www-fetched'
        },
        files: [
          // matching file names will be prefixed with "baseURL" for fetching
          {
            src: ['**/*.html', '!url.html', '!not-expanded.html', '!**/parsedlink*.html'],
            expand: true,
            cwd: 'test/www-root/'
          },
          {
            src: ['not-expanded.html', '!**/parsedlink*.html'],
            expand: false,
            cwd: 'test/www-root/'
          }
        ]
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

  grunt.registerTask('test', ['jshint', 'clean:test', 'express:test', 'fetchpages:test', 'nodeunit:test']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
