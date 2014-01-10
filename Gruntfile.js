'use strict';
module.exports = function(grunt) {

    var SRC = "src",
        TARGET = "target",
        DIST = "dist";

  grunt.initConfig({
      clean: [TARGET],
      requirejs: {
          development: {
              // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
              options: {
                  baseUrl: SRC,
                  dir: TARGET,
                  optimize: "none",
                  keepBuildDir: true,
                  skipDirOptimize: true,
                  preserveLicenseComments: true,
                  fileExclusionRegExp: /^\.|\.ts|\.map/
              }
          },
          release: {
              options: {
                  name: SRC + "/Weez",
                  out: DIST + "/Weez.js",
                  optimize: "none",
                  keepBuildDir: true,
                  skipDirOptimize: true,
                  removeCombined: true,
                  preserveLicenseComments: true,
                  fileExclusionRegExp: /^\.|\.ts|\.map/
              }

          }
      },
      typescript: {
          development: {
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
          },
          release: {
              files: [
                  {src: [ SRC + '/**/*.ts'], dest: SRC}
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
              },
              keepRunner: true
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
        'typescript:development',
        'requirejs:development'
    ]);

    grunt.registerTask('test', [
        'jasmine'
    ]);

    grunt.registerTask('release', [
        'typescript:release',
        'requirejs:release'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
}