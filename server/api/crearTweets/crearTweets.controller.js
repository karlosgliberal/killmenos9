'use strict';

var Twit = require('twit');
var _ = require('lodash');
var config  = require('../../config/killmenos9');
var async = require('async');
var fs = require('fs');
var gm = require('gm');
var twitter = new Twit(config.twitter);
var pathImage;

if(process.env.NODE_ENV === 'development'){
  pathImage = '/Users/flatline/src/proyectos/killmenos9/client/assets/images/notificaciones/';
}else{
  pathImage = '/var/node/killmenos9/public/assets/images/notificaciones/';
}
// Get list of images
exports.index = function(req, res) {
  console.log(process.env.NODE_ENV);
  res.json('loco');
  estado = 0;
};

// Get list of images
exports.show = function(req, res) {
    var nombre = req.query.name;
    var b64content = fs.readFileSync(pathImage + nombre +'.png', { encoding: 'base64' })

    twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    console.log(mediaIdStr);
    var altText = "Subiendo fotos."
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    console.log(meta_params);
    var params = { status: 'Search and destroy  @' + nombre + ' http://flm.interzonas.info/kill.html', media_ids: [mediaIdStr] }
    twitter.post('statuses/update', params, function (err, data, response) {
      console.log(data)
      if(err) console.log(err);
    })
   })
 res.json({estado:'ds'});
};
