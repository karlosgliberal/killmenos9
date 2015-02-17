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
var user_id = [];

// Get list of things
exports.index = function(req, res) {
  console.log(req);
  res.json('recoger')
};

exports.show = function(req, res){
  var listaUsuarios = req.params.id
  var usersArray = listaUsuarios.split(','); 
   // getUserTweets(usersArray, function(err, datos){
   //   console.log('res', datos);
   // });

   haceBucle(usersArray, function(err, dat){
      getUserTweets(dat, function(err, datos){
        console.log(datos);
      });
   })

   function haceBucle(user_id, cb){
    if (!user_id) cb(null, null);
    var i = 0, len = user_id.length;
    for(i; i < len; i++) {
      cb(null, user_id[i]);
    }
   }

   function getUserTweets (user_id, cb){
    if (!user_id) cb(null, null);
    var datos = [];
      twitter.get('statuses/user_timeline', {user_id:user_id, exclude_replies:true, count:2, include_rts:false}, function(err, data, resp){
        var tweets = data;
        var v = 0, lens = tweets.length;
        for(v; v < lens; v++) {
          // console.log('text: ', tweets[i].text);
          datos.push(tweets[v].text);
          //compararTextDic(tweets[i].text, tweets[i].user.screen_name);
        }
        cb(null, datos);
      });
    
  }

  function compararTextDic(text, screen_name){
    var texto = text.split(' ');
    var s1 = new sets.Set(texto);
    var s2 = new sets.Set(diccionario);

    var resultado =  s1.intersection(s2).array();

    if(resultado.length > 1){
       console.log('usuario', screen_name);
      // console.log('Mensaje', text);
      datos.push({"name":screen_name});
      console.log('Intersection:', s1.intersection(s2).array());
    }else{
      //console.log('No hay resulstados');
    }
  };
  res.json(datos);
};