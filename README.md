grunt-imageoptim-watch
======================
What you can do with grunt

1. Gruntでimageoptim, imageminを実行
2. 指定したフォルダの追加、変更をwatchして自動的に画像最適化可能

How to use
======================
I first install the following plug-ins

1. grunt-conrib-imagemin
(https://github.com/gruntjs/grunt-contrib-imagemin)
2. grunt-imageoptim
(https://github.com/JamieMason/grunt-imageoptim)
3. grunt-contrib-livereload
(https://github.com/gruntjs/grunt-contrib-livereload)
4. grunt-contrib-watch
(https://github.com/gruntjs/grunt-contrib-watch)

### Livereload & Watch
It performs the task if you will be monitoring the filepath set by the task of imagemin and imageoptim, changes and additions were made.

```JavaScript:Gruntfile.js
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
```

Imageoptim App
----------------------
Install from here.
http://imageoptim.com/
![Alt text](https://raw.github.com/tanamako/grunt-imageoptim-watch/master/assets/images/imageoptim.png)

Licence
======================

The MIT License (MIT)

Copyright (c) 2013 by Makoto Tanaka