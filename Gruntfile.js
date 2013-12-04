'use strict';

var folderMount, lrSnippet, path;

path = require('path');

lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

folderMount = function(connect, point) {
  return connect["static"](path.resolve(point));
};


module.exports = function(grunt) {
  var changedFiles, onChangeImage;
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    connect: {
      livereload: {
        options: {
          hostname: '0.0.0.0',
          port: 3501,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, './htdocs')];
          }
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      imageoptim: {
        files: ['assets/images/other'],
        tasks: ['imageoptim:feature'],
        options: {
          event: ['added', 'changed'],
          livereload: false
        }
      },
      imagemin: {
        files: ['assets/**/*.{png,jpg,jpeg}'],
        tasks: ['imagemin:ondemand'],
        options: {
          event: ['added', 'changed'],
          livereload: false
        }
      }
    },
    // 全体的に圧縮率高めの時
    imageoptim: {
      files: ['assets/images/other'],         // Target
      options: {
        jpegMini: false,
        imageAlpha: false,
        quitAfter: false
      }
    },
    // 全体的に圧縮率低め
    imagemin: {
      dist: {
        optimizationLevel: 3,
        files: [
          {
            expand: true,
            src: 'assets/**/*.{png,jpg,jpeg}'
          }
        ]
      },
      dynamic: {                         // Another target
        options: {                       // Target options
          optimizationLevel: 7
        },
        files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: 'src/',                   // Src matches are relative to this path
        src: ['assets/images/tutorial/*.{png,jpg,gif}'],   // Actual patterns to match
        dest: 'dist/'                  // Destination path prefix
        }]
      },
      ondemand: {
        optimizationLevel: 3,
        files: []
      }
    }

  });

  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.registerTask('default', ['imageoptim','imagemin','watch']);


  changedFiles = Object.create(null);
  onChangeImage = grunt.util._.debounce(function() {
    var filesArray, paths;
    paths = Object.keys(changedFiles);
    filesArray = [];
    paths.forEach(function(path) {
      filesArray.push({
        src: path,
        dest: path
      });
    });
    grunt.config(['imageoptim', 'feature', 'files'], filesArray);
    grunt.config(['imagemin', 'ondemand', 'files'], filesArray);
    changedFiles = Object.create(null);
  }, 200);

  grunt.event.on('watch', function(action, filepath) {
    changedFiles[filepath] = action;
    if (/\.(png|jpg)$/.test(filepath)) {
      onChangeImage();
    }
  });
};