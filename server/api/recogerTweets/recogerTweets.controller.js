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
var async = require('async');

var twitter = new Twit(config.twitter);
var diccionario = config.diccionario;


// Get list of things
exports.index = function(req, res) {
  console.log(req);
  res.json('recoger')



};

exports.show = function(req, res){
  var datos = [];
  var listaUsuarios = req.params.id
  var users_id = listaUsuarios.split(',');
  var i = 0, len = users_id.length; 

  async.each(users_id,
    function(userId, callback){
      twitter.get('statuses/user_timeline', {user_id:userId, exclude_replies:true, count:10, include_rts:false}, function(err, data, resp){
        var tweets = data;
        var i = 0, len = tweets.length; 
        for(i; i < len; i++) {
          datos.push({name:tweets[i].user.screen_name, id:tweets[i].user.screen_name, text:tweets[i].text});
        }
        callback();
      })
    },
    function(err){
     doSomethingOnceAllAreDone();
    }
  );

  function doSomethingOnceAllAreDone(){
    var paraEnviar = [];
    var i = 0, len = datos.length;
    console.log(datos);
    var s2 = new sets.Set(diccionario);

    for(i; i < len; i++){
      //console.log(datos[i].text);
      var frase = datos[i].text;
      var texto = frase.split(' ');
      var s1 = new sets.Set(texto);
      var resultado =  s1.intersection(s2).array();
      if(resultado.length > 1){
         console.log('text', datos[i].text);
         console.log('Intersection:', s1.intersection(s2).array());
         paraEnviar.push({name:datos[i].id});
      }else{
      }
    }
    res.json(paraEnviar);
  }
}


exports.show_bak = function(req, res){
  var listaUsuarios = req.params.id
 
  console.log(req.params.id);
  getUserTweets(req.params.id, function(err, datos){
    console.log('res', datos);
    res.json(datos);
  });

   function getUserTweets (user_id, cb){
    if (!user_id) cb(null, null);
    var datos = [];
    twitter.get('statuses/user_timeline', {user_id:user_id, exclude_replies:true, count:20, include_rts:false}, function(err, data, resp){
      var tweets = data;
      var i = 0, len = tweets.length;
      for(i; i < len; i++) {
        console.log('text: ', tweets[i].text);
        datos.push(tweets[i].user.screen_name);
        compararTextDic(tweets[i].text, tweets[i].user.screen_name);
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
       console.log('Mensaje', text);
      datos.push({"name":screen_name});
      console.log('Intersection:', s1.intersection(s2).array());
    }else{
    }
  };
  res.json(datos);
};