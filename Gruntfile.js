module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

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
            }
        },
        babel: {
            options: {
                sourceMap: true,
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
                tasks: ['concat:ES6', 'babel', 'notify:js'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        },
        clean: {
            dist: [
                'dist/ES6.js',
                'dist/ES6.js.map',
                'dist/app.min.js.map'
            ]
        },
        usebanner: {
            copyright: {
                options: {
                    position: 'top',
                    banner: '/* <%= pkg.name %> <%= pkg.version %> - <%= pkg.website %> */',
                    linebreak: true
                },
                files: {
                    src: ['dist/splitplayer.min.css', 'dist/splitplayer.min.js']
                }
            }
        }
    });

    grunt.registerTask('deploy', [
        'concat:ES6', // concat all es6 files to one
        'babel', // convert es6 to es5
        'uglify', // concat converted files and normal files
        'usebanner:copyright', // insert banner
        'clean:dist' // clean
    ]);

};
