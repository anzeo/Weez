module.exports = function (grunt) {
    'use strict';
    
    var SRC = "src",
        TST = "test";

    grunt.initConfig({
        clean: {
            development: SRC + '/**/*.js',
            test: TST + '/**/*.js'
        },
        typescript: {
            development: {
                files: [
                    {src: [ SRC + '/**/*.ts'], dest: '/'}
                ],
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: false
                }
            },
            test: {
                files: [
                    {src: [ TST + '/**/*.ts'], dest: '/'}
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
            all: [TST + '/']
        }
    });

    // load in grunt tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // register CLI tasks
    grunt.registerTask('build', [
        'clean:development',
        'typescript:development'
    ]);

    grunt.registerTask('test', [
        'clean:test',
        'typescript:test',
        'jasmine_node'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};
