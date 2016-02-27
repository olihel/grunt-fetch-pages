# grunt-fetch-pages Release Notes

### 2.0.0 (2016-02-27)
 * peerDependencies updated to support upcoming Grunt 1.0
 * dependencies and devDependencies updated
 * **node js >= 4.0.0 required**  
 This is required by the updated dependency "jsdom", see [jsdom changelog](https://github.com/tmpvar/jsdom/blob/master/Changelog.md#700) for more information
 * Travis build matrix updated
 * minor cleanup

### 1.0.5 (2015-02-21)
 * add io.js to Travis build matrix
 * dependencies updated

### 1.0.4 (2015-02-16)
 * fixed [issue #3](https://github.com/olihel/grunt-fetch-pages/issues/3)
 * dependencies updated

### 1.0.3 (2015-01-06)
 * fixed [issue #1](https://github.com/olihel/grunt-fetch-pages/issues/1)

### 1.0.2 (2014-12-10)
 * dependencies updated

### 1.0.1 (2014-12-09)
 * added warning indicating links that can't be followed due to a missing "href" attribute
 * dependencies updated
 * Travis configuration improved

### 1.0.0 (2014-03-07)
 * API change: "filesBaseURL" renamed to "baseURL"
 * API change: "target" option renamed to "destinationFolder"
 * added "followLinks" option for fetched pages
 * added "ignoreSelector" option
 * added "cleanHTML" option
 * added "fetchBaseURL" option

### 0.2.2 (2014-01-26)
 * unit testing large file
 * dependencies updated

### 0.2.1 (2013-08-20)
 * dependencies updated

### 0.2.0 (2013-08-04)
 * fetching URL list added
 * option "baseURL" -> "filesBaseURL"

### 0.1.3 (2013-07-29)
 * Continuous integration tests via Travis CI
 * dependencies updated

### 0.1.2 (2013-07-21)
 * Badges added

### 0.1.1 (2013-07-19)
 * Unit tests added

### 0.1.0 (2013-07-17)
 * Initial version
