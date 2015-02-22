/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var Twit = require('twit');
var _ = require('lodash');
var sets = require('simplesets');
var config  = require('../../config/killmenos9'); 

var twitter = new Twit(config.twitter);
var diccionario = config.diccionario;
var datos = [];

// Get list of things
exports.index = function(req, res) {
  console.log(req);
  res.json('index patron');
};

exports.show = function(req, res){
  var params = {
    q: req.params.id,
    result_type: "mixed",
    count: 4,
    lang:"es",
    include_entities: false
  };

  twitter.get('search/tweets', params, function(err, data, resp){
    var datos = [];
    var tweets = data.statuses; 
    var i = 0, len = tweets.length;
    for(i; i < len; i++) {
      datos.push({id:tweets[i].user.id, img:tweets[i].user.profile_image_url,name:tweets[i].user.screen_name});
    }
    console.log('uuarios', datos.length);
    res.json(datos);
  });
};