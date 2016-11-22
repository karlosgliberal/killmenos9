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
  gm('./client/assets/images/notificaciones/carta.jpg')
  .stroke("#000000")
  .font("Helvetica.ttf", 16)
  .drawText(164, 390, req.query.patron)
  .drawText(164, 562, req.query.name)
  .drawText(221, 604, req.query.palabras)
  .drawText(164, 646, req.query.fraseOrig)
  .drawText(140, 700, req.query.fecha)
  .write("./client/assets/images/notificaciones/"+req.query.name+".png", function (err) {
    if(err){
    }else{
    }
  });
 res.json({name:req.query.name});
};
