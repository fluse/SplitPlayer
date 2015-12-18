module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    var tasks = [
        'concat:ES6', // concat all es6 files to one
        'babel', // convert es6 to es5
        'uglify:appJs', // concat converted files and normal files
        'concat:standalone', // concat all es6 files to one
        'uglify:standalone', // concat converted files and normal files
        'usebanner:copyright', // insert banner
        'clean:dist' // clean
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            ES6: {
                options: {
                    sourceMap: false
                },
                src: 'src/**/*.js',
                dest: 'dist/ES6.js'
            },
            standalone: {
                options: {
                    sourceMap: false
                },
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/underscore/underscore.js',
                    'dist/splitplayer.js'
                ],
                dest: 'dist/splitplayer.standalone.js'
            }
        },
        babel: {
            options: {
                sourceMap: false,
                stage: 2
            },
            dist: {
                files: {
                    'dist/splitplayer.js': 'dist/ES6.js'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: false,
            },
            appJs: {
                src: 'dist/splitplayer.js',
                dest: 'dist/splitplayer.min.js'
            },
            standalone: {
                src: 'dist/splitplayer.standalone.js',
                dest: 'dist/splitplayer.standalone.min.js'
            }
        },
        notify: {
            js: {
              options: {
                message: 'JS files compiled', //required
              }
          },
          css: {
            options: {
              message: 'JS files compiled', //required
            }
          }
        },
        watch: {
            js: {
                files: ['src/**/*'],
                tasks: tasks,
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        },
        clean: {
            dist: [
                'dist/ES6.js',
                'dist/*.map'
            ]
        },
        usebanner: {
            copyright: {
                options: {
                    position: 'top',
                    banner: '/* <%= pkg.name %> <%= pkg.version %> - <%= pkg.website %> - copyright <%= pkg.author %> */',
                    linebreak: true
                },
                files: {
                    src: ['dist/*.js']
                }
            }
        }
    });

    grunt.registerTask('deploy', tasks);

};
