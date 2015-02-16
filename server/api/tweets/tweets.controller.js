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
var keys  = {
  consumer_key: '9LootcW3doB8L3teaj2rLzn0v',
  consumer_secret: 'DRlc927RbFmavAZnPrlQJEtVhOsOSeuHaJfdYHZu34Uuh3l8Rx',
  access_token: '3022202798-QZ49mwQ6JjKflV0oc09qxwieHZh8A3DvDz4S3Zx',
  access_token_secret: 't2l7fags317rA29cmHipmBsd6XV20dPusitI9AKHw5eQ9'
}

var twitter = new Twit(keys);


// Get list of things
exports.index = function(req, res) {

  var params = {
    q: "pamplona",
    result_type: "mixed",
    count: 3,
    include_entities: true
  };

  twitter.get('search/tweets', params, function(err, data, resp){
    var datos = [];
    var tweets = data.statuses; 
    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      datos.push({"name":tweets[i].user.screen_name});
    }
    console.log(datos);
    res.json(datos);
  });


};