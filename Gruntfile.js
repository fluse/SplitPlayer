module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    var tasks = [
        'usebanner:copyright', // insert banner
        'clean:dist' // clean
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                tasks: ['shell:compile'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        },
        shell: {
            compile: {
                command: 'cd scripts/ && sh compile.sh'
            }
        },
        clean: {
            dist: [
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
