'use strict';

var _ = require('lodash');
var fs = require('fs')
  , gm = require('gm');

// Get list of images
exports.index = function(req, res) {
  res.json([]);
};

// Get list of images
exports.show = function(req, res) {
  console.log('hola');

  gm('/Users/flatline/src/proyectos/killmenos9/server/api/image/carta.png')
  .stroke("#000000")
  .font("Helvetica.ttf", 80)
  .drawText(10, 10, "hola  que pasa ")
  .write("/Users/flatline/src/experimentos/create_img/carta.png", function (err) {
    if(err){
      console.log(err);
    }else{
      console.log('bien');
    }
  });
  // res.json();
};