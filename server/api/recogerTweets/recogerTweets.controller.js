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
      twitter.get('statuses/user_timeline', {user_id:userId, exclude_replies:true, count:4, include_rts:false}, function(err, data, resp){
        var tweets = data;
        var i = 0, len = tweets.length; 
        for(i; i < len; i++) {
          console.log(tweets[i].text);
          datos.push({
            name:tweets[i].user.screen_name, 
            id:tweets[i].user.id, 
            text:tweets[i].text, 
            img:tweets[i].user.profile_image_url
          });
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
    var s2 = new sets.Set(diccionario);

    for(i; i < len; i++){
      var frase = datos[i].text;
      var texto = frase.split(' ');
      var s1 = new sets.Set(texto);
      var resultado =  s1.intersection(s2).array();
      if(resultado.length > 1){
         console.log('text', datos[i].text);
         console.log('Intersection:', s1.intersection(s2).array());
         var u = 0, lenr = resultado.length;
         for(u; u < lenr; u++){
           var span = '<span class="seleccionado">'+ resultado[u] +'</span>';
           var textSpan = frase.replace(resultado[u], span);
           console.log(textSpan); 
         }
         paraEnviar.push({
          name:datos[i].name, 
          id:datos[i].id, 
          text:textSpan, 
          img:datos[i].img, 
          total:datos.length, 
          clase:'clase ' + i});
      }else{
      }
    }
    res.json(paraEnviar);
  }
}
