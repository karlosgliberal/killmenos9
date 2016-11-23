'use strict';
var Twit = require('twit');
var config  = require('../../config/killmenos9');
var _ = require('lodash');
var fs = require('fs')
  , gm = require('gm');
var twitter = new Twit(config.twitter);

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
      console.log(err);
    }else{
    }
  });
  var nombre = req.query.name;
  var b64content = fs.readFileSync('/Users/flatline/src/proyectos/killmenos9/client/assets/images/notificaciones/'+nombre+'.png', { encoding: 'base64' })

// first we must post the media to Twitter
  twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  console.log(mediaIdStr);
  var altText = "Subiendo fotos."
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
  console.log(meta_params);
  var params = { status: 'Search and destroy @patxangas ' + nombre + ' .', media_ids: [mediaIdStr] }
  twitter.post('statuses/update', params, function (err, data, response) {
    console.log(data)
    if(err) console.log(err);
  })
 })
 res.json({name:req.query.name});
};
