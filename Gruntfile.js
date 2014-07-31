'use strict';
module.exports = function(grunt) {

    var SRC = "src",
        TARGET = "target",
        DIST = "dist";

  grunt.initConfig({
      clean: [TARGET],
      typescript: {
          development: {
              files: [
                 {src: [ SRC + '/**/*.ts'], dest: '/'},
                 {src: ['test/**/*.ts'], dest: '/'}
              ],
              options: {
                  module: 'commonjs',
                  target: 'es5',
                  sourcemap: false,
                  fullSourceMapPath: false,
                  declaration: false
              }
          }
      },
      jasmine_node: {
          options: {
              forceExit: true,
              match: '.',
              matchall: true,
              extensions: 'js',
              specNameMatcher: ''

          },
          all: ['test/']
      }
  });

    // load in grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // register CLI tasks
    grunt.registerTask('build', [
        'typescript'
    ]);

    grunt.registerTask('test', [
        'jasmine_node'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
}
