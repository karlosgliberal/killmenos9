'use strict';

var Twit = require('twit');
var _ = require('lodash');
var config  = require('../../config/killmenos9');
var async = require('async');
var fs = require('fs');
var gm = require('gm');

var estado = 0;

// Get list of images
exports.index = function(req, res) {
  res.json('loco');
  estado = 0;
};

// Get list of images
exports.show = function(req, res) {
  var twitter = new Twit(config.twitter);
  console.log(req.params);
  var b64content = fs.readFileSync('/Users/flatline/src/proyectos/killmenos9/client/assets/images/notificaciones/'+req.params.name+'.png', { encoding: 'base64' })

// first we must post the media to Twitter
  twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  console.log(mediaIdStr);
  var altText = "Subiendo fotos."
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
  console.log(meta_params);
  var params = { status: 'Search and estroy for' + req.params.name + ' .', media_ids: [mediaIdStr] }
  twitter.post('statuses/update', params, function (err, data, response) {
    console.log(data)
    if(err) console.log(err);
  })
})
 res.json({estado:'ds'});
};
