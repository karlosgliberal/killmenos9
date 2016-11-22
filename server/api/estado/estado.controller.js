'use strict';

var _ = require('lodash');
var fs = require('fs')
  , gm = require('gm');

var estado = 0;

// Get list of images
exports.index = function(req, res) {
  res.json({estado:estado});
};

// Get list of images
exports.show = function(req, res) {
 estado = 1;
 res.json({estado:estado});
};
