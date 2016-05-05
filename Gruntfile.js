'use strict';
var path = require('path');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [folderMount(connect, options.base)]
          }
        }
      }
    },
    watch: {
      main: {
        options: {
            livereload: false,
            spawn: false
        },
        files: ['js/**/*','logics/**/*','css/**/*','img/**/*','assets/**/*','service/**/*','filter/**/*','directive/**/*','index.html'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },
    jshint: {
      main: {
        options: {
            jshintrc: '.jshintrc'
        },
        src: ['js/**/*.js','logics/**/*.js','assets/**/*.js','service/**/*.js','filter/**/*.js','directive/**/*.js']
      }
    },
    clean: {
      before:{
        src:['dist','temp']
      },
      after: {
        src:['temp']
      }
    },
    /*
    less: {
      production: {
        options: {
        },
        files: {
          "temp/app.css": "css/app.less"
        }
      }
    },
    */
    ngtemplates: {
      main: {
        options: {
            module:'remont',
            htmlmin: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            }
        },
        src: [ 'partial/**/*.html','directive/**/*.html' ],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [
          {src: ['*.html'], dest: 'dist/'},
          {src: ['package.json'], dest: 'dist/version'},
          {src: ['assets/**'], dest: 'dist/'},
          {src: ['images/**'], dest: 'dist/'},
          {src: ['main/**'], dest: 'dist/'},
          {src: ['api/**'], dest: 'dist/'},

          {src: ['bower_components/**'], dest: 'dist/'},
          {src: ['node_modules/**'], dest: 'dist/'},

          {src: ['robots.txt'], dest: 'dist/'},
          {src: ['sitemap.xml'], dest: 'dist/'},
          {src: ['metrika.js'], dest: 'dist/'},
          {src: ['favicon.ico'], dest: 'dist/'},
        ]
      },
      
      css:{
        // this is called only when quick target is built
        files: [
          {
               expand: true,
               src: ['css/**'], 
               dest: 'dist/',
          }
        ] 
      },

      js:{
        files: [
          {src: ['assets/js/**'], dest: 'dist/'},
          {src: ['js/**'], dest: 'dist/'},
          {src: ['logics/**'], dest: 'dist/'}
        ]
      }
    },

    dom_munger:{
      readscripts: {
        options: {
          read:{selector:'script[data-build!="exclude"]',attribute:'src',writeto:'appjs'}
        },
        src:'index.html'
      },
      readcss: {
        options: {
          read:{selector:'link[rel="stylesheet"]',attribute:'href',writeto:'appcss'}
        },
        src:'index.html'
      },
      removescripts: {
        options:{
          remove:'script[data-remove!="exclude"]',
          append:{selector:'head',html:'<script src="app.full.min.js"></script>'}
        },
        src:'dist/index.html'
      },

      removescripts2: {
        options:{
          remove:'script[data-remove!="exclude"]',
          append:{selector:'head',html:'<script src="engine.full.min.js"></script>'}
        },
        src:'dist/engine.html'
      },

      addscript: {
        options:{
          append:{selector:'body',html:'<script src="app.full.min.js"></script>'}
        },
        src:'dist/index.html'
      },

      addscript_engine: {
        options:{
          append:{selector:'body',html:'<script src="engine.full.min.js"></script>'}
        },
        src:'dist/engine.html'
      },

      addscript_bower: {
        options:{
          append:{selector:'body',html:'<script src="bower.full.min.js"></script>'}
        },
        src:'dist/engine.html'
      },

      addscript_yandex: {
        options:{
          append:{selector:'body',html:'<script src="https://yandex.st/share/share.js"></script>'}
        },
        src:'dist/engine.html'
      },

      addscript_vk: {
        options:{
          append:{selector:'body',html:'<script src="https://vk.com/js/api/openapi.js" type="text/javascript"></script><script type="text/javascript">VK.init({apiId: 5013021});</script>'}},
        src:'dist/engine.html'
      },

      addscript_metrika1: {
        options:{
          append:{selector:'body',html:'<script src="metrika.js"></script>'}
        },
        src:'dist/index.html'
      },

      addscript_metrika2: {
        options:{
          append:{selector:'body',html:'<script src="metrika.js"></script>'}
        },
        src:'dist/engine.html'
      },

      addfavicon: {
        options:{
          append:{selector:'head',html:'<link rel="icon" href="img/favicon.ico" type="image/x-icon" />'}
        },
        src:'dist/index.html'
      },

      removecss: {
        options:{
          remove:'link',
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'dist/index.html'
      },
      addcss: {
        options:{
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'dist/index.html'
      }
    },    //dom_munger

    cssmin: {
      main: {
        src:['css/app.css','<%= dom_munger.data.appcss %>'],
        dest:'dist/css/app.full.min.css'
      }
    },

    concat: {
      main: {
        src: ['<%= dom_munger.data.appjs %>','<%= ngtemplates.main.dest %>'],
        dest: 'temp/app.full.js'
      },

      engine: {
        src: [
          'logics/setup.js'
        ],
        dest: 'temp/engine.full.js'
      },

      bower: {
        src: [
          'bower_components/angular/angular.js', 
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-animate/angular-animate.js', 
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js', 
          'bower_components/angular-ui-utils/ui-utils.js', 
          'bower_components/angular-cookies/angular-cookies.js', 
          'bower_components/ngDialog/js/ngDialog.js',
          'bower_components/Chart.js/Chart.min.js',
          'bower_components/angular-chart.js/dist/angular-chart.js',
          'bower_components/bowser/bowser.min.js'
        ],
        dest: 'temp/bower.full.js'
      }
    },

    ngmin: {
      main: {
        src:'temp/app.full.js',
        dest: 'temp/app.full.min.js'
      },

      engine: {
        src:'temp/engine.full.js',
        dest: 'temp/engine.full.min.js'
      },

      bower: {
        src:'temp/bower.full.js',
        dest: 'temp/bower.full.min.js'
      }
    },

    uglify: {
      main: {
        src: 'temp/app.full.js',
        dest:'dist/app.full.min.js'
      },

      engine: {
        src: 'temp/engine.full.min.js',
        dest:'dist/engine.full.min.js'
      },

      bower: {
        src: 'temp/bower.full.min.js',
        dest:'dist/bower.full.min.js'
      }
    },

    //////////////////////////////////////
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/index.html':'dist/index.html',
          'dist/generic.html':'dist/generic.html',
          'dist/elements.html':'dist/elements.html',
          'dist/contact.html':'dist/contact.html'
        }
      }
    },
    imagemin: {
      main:{
        files: [{
          expand: true, cwd:'dist/',
          src:['**/{*.png,*.jpg}'],
          dest: 'dist/'
        }]
      }
    },
    jasmine: {
      unit: {
        src: ['<%= dom_munger.data.appjs %>','bower_components/angular-mocks/angular-mocks.js'],
        options: {
          keepRunner: true,
          specs: ['js/**/*-spec.js','partial/**/*-spec.js','service/**/*-spec.js','filter/**/*-spec.js','directive/**/*-spec.js']
        }
      }
    },

    shell: {
      bumpVersion: {
        command: 'npm version patch',
        options:
        {
             failOnError: true,
        }
      },

      deployToServer: {
        command: 'rsync -avz -e "ssh -i /Users/tonykent/.ssh/hackaton.pem" --progress dist/* ubuntu@api.factorb.ru:/var/www/html/',
        options:
        {
             failOnError: true,
             execOptions: {
                  maxBuffer: Infinity
             }
        }
      },

      deployToTest: {
        command: 'rsync -avz -e "ssh -i /home/rus/.ssh/adaperio_frontend_test.pem" --progress dist/* ubuntu@api.factorb.ru:/var/www/html/',
        options:
        {
             failOnError: true,
             execOptions: {
                  maxBuffer: Infinity
             }
        }
      }

    }
  });

  // Non-optimized web-site
  grunt.registerTask('build',[
	'clean:before',

	'dom_munger:readcss',
	'dom_munger:readscripts',

	'concat',
	'ngmin',
	'uglify',

	'copy',
     'copy:css',
     'copy:js',

	'clean:after'
]);

  // Optmized web site (good for deployment)
  grunt.registerTask('release',[
	'jshint',
	'clean:before',
	'dom_munger:readcss',
	'dom_munger:readscripts',
	'ngtemplates',
	'cssmin',

	'concat',
	'ngmin',
	'uglify',

	'copy',
     'copy:css',
     'copy:js',
	'dom_munger:removecss',
	'dom_munger:addcss',
	'dom_munger:removescripts',
	'dom_munger:addscript',
	'dom_munger:addfavicon',
	'htmlmin',
	'imagemin',
	'clean:after']);

  grunt.registerTask('server', [
     'dom_munger:readscripts',

     // WARNING: too many warnings))))
     // Uncomment to see them
     //'jshint',

     'connect', 
     'watch'
  ]);

  grunt.registerTask('test',['dom_munger:readscripts','jasmine']);

  grunt.registerTask('deploy', [
    'clean',
    'shell:bumpVersion',      // this requires everything to be commited
    'build',
    'shell:deployToServer'
  ]);

  grunt.registerTask('deploy-test', [
    'clean',
    //'shell:bumpVersion',      // this requires everything to be commited
    'build',  //'release'
    'shell:deployToTest'
  ]);


  grunt.event.on('watch', function(action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      grunt.task.run('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        var spec = filepath.substring(0,filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        grunt.config('jasmine.unit.options.specs',spec);
        grunt.task.run('jasmine:unit');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of jasmine
    //will have the correct environment
    if (filepath === 'index.html') {
      grunt.task.run('dom_munger:readscripts');
    }

  });

};
