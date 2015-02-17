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
var keys  = {
  consumer_key: '9LootcW3doB8L3teaj2rLzn0v',
  consumer_secret: 'DRlc927RbFmavAZnPrlQJEtVhOsOSeuHaJfdYHZu34Uuh3l8Rx',
  access_token: '3022202798-QZ49mwQ6JjKflV0oc09qxwieHZh8A3DvDz4S3Zx',
  access_token_secret: 't2l7fags317rA29cmHipmBsd6XV20dPusitI9AKHw5eQ9'
}

var twitter = new Twit(keys);
var diccionario = ["ultimátum", "bourne", "ojo", "aguja", "vertigo", "sospechosos", "habituales", "uno", "nuestros", "análisis", "final", "dilema", "noche", "nuestra", "nombre", "rosa", "informe", "pelicano", "juego", "hombre", "sabía", "demasiado", "red", "mentiras", "homeland", "alarma", "expreso", "espías", "tres", "días", "cóndor", "servicio", "secreto", "vida", "otros", "misión", "imposible", "prueba", "conspiración", "pánico", "muerte", "talones", "movilizaciones", "visto", "políticas", "asesinos", "agencia", "orgullo", "Secretos", "Plaza", "Castilla", "sufren", "punto" ];

var datos = [];

// Get list of things
exports.index = function(req, res) {
  console.log(req);

  var params = {
    q: "pamplona",
    result_type: "mixed",
    count: 10,
    include_entities: true
  };

  twitter.get('search/tweets', params, function(err, data, resp){
    var tweets = data.statuses; 
    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      datos.push({"name":tweets[i].user.screen_name});
    }
    console.log(datos);
    res.json(datos);
  });

};

exports.show = function(req, res){
  console.log(req.params);
  var params = {
    q: req.params.id,
    result_type: "mixed",
    count: 10,
    include_entities: true
  };

  twitter.get('search/tweets', params, function(err, data, resp){
    var datos = [];
    var tweets = data.statuses; 
    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getUserTweets(tweets[i].user.id);
    }
    console.log(datos);
    //res.json(datos);
  });

  var getUserTweets = function(user_id){
    twitter.get('statuses/user_timeline', {user_id:user_id, exclude_replies:true, count:20, include_rts:false}, function(err, data, resp){
      var tweets = data;

      var i = 0, len = tweets.length;

      for(i; i < len; i++) {
        console.log('nombre: ', tweets[i].user.screen_name);
        console.log('text: ', tweets[i].text);
        compararTextDic(tweets[i].text, tweets[i].user.screen_name);
      }
    });
  }

  var compararTextDic = function(text, screen_name){
    var texto = text.split(' ');
    var s1 = new sets.Set(texto);
    var s2 = new sets.Set(diccionario);
    //console.log(s1);


    var resultado =  s1.intersection(s2).array();

    if(resultado.length > 1){
      console.log('usuario', screen_name);
      console.log('Mensaje', text);
      datos.push({"name":screen_name});
      console.log('Intersection:', s1.intersection(s2).array());
      res.json(datos);
    }else{
      //console.log('No hay resulstados');
    }
  };


};