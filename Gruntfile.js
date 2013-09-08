'use strict';
module.exports = function(grunt) {

    var SRC = "src",
        TARGET = "target";

  grunt.initConfig({
      clean: [TARGET],
      requirejs: {
          compile: {
              // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
              options: {
                  baseUrl: SRC,
                  dir: TARGET,
                  optimize: "none",
                  keepBuildDir: true,
                  skipDirOptimize: true,
                  removeCombined: true,
                  preserveLicenseComments: true,
                  fileExclusionRegExp: /^\.|\.handlebars|\.ts|\.map/
              }
          }
      },
      typescript: {
          base: {
              files: [
                 {src: [ SRC + '/**/*.ts'], dest: SRC},
                 {src: ['test/**/*.ts'], dest: 'test'}
              ],
              options: {
                  module: 'amd',
                  target: 'es5', //or es3
                  base_path: SRC,
                  sourcemap: false,
                  fullSourceMapPath: false,
                  declaration: false
              }
          }
      },
      jasmine: {
          src: 'src/**/*.js',
          options: {
              specs: 'test/**/*.js',
              template: require('grunt-template-jasmine-requirejs'),
              templateOptions: {
                  requireConfig: {
                      baseUrl: "./",
                      urlArgs: "bust=" + Math.random()
                  }
              }
          }
      }
  });

    // load in grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-typescript');

    // register CLI tasks
    grunt.registerTask('build', [
        'clean',
        'typescript',
        'requirejs'
    ]);

    grunt.registerTask('test', [
        'jasmine'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
}