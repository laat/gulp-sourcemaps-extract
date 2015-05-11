/* jshint node: true */
'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var objectAssign = require('object-assign');
var applySourceMap = require('vinyl-sourcemaps-apply');
var convert = require('convert-source-map');

module.exports = function (options) {
    options = options || {};


    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-sourcemaps-extract', 'Streaming not supported'));
            return;
        }

        if (file.sourceMap) {
            var content = file.contents.toString();

            var map = convert.fromSource(content);
            map.sourcemap.file = file.sourceMap.file;
            file.contents = new Buffer(convert.removeComments(content));
            applySourceMap(file, map.sourcemap);
        }

        this.push(file);
        cb();
    });
};
