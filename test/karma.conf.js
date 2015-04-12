// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-03 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        preprocessors: {
            'src/oauth2Templates/**/*.html': ['ng-html2js'],
            'src/**/*.js': ['coverage']
        },

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/angular-route/angular-route.js',
            'src/oauth2Templates/**/*.html',
            'src/**/*.js',
            'test/spec/**/*.js'
        ],

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'src/'
            //stripSufix: '.ext',
            //// prepend this to the
            //prependPrefix: 'served/',
            //
            ////// or define a custom transform function
            ////cacheIdFromPath: function(filepath) {
            ////  return cacheId;
            ////},
            //
            //// setting this option will create only a single module that contains templates
            //// from all the files, so you can load them all with module('foo')
            //moduleName: 'foo'
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-ng-html2js-preprocessor',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};