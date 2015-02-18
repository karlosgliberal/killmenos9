'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
  
    $scope.listaPalabras = [
      {name:'pamplona', id:1},
      {name:"desahucios", id:2},
      {name:"crisis", id:3}, 
      {name:"crimen", id:4},
      {name:"asesinos", id:5},
      {name:"madrid", id:6},
    ];

    $scope.listaUsuarios = [];
    $scope.selection=[];
    $scope.resultadoAlgoritmo = [];
    $scope.objetivos = [];

    $scope.buscarPatron = function buscarPatron(palabras){
      var idx = $scope.selection.indexOf(palabras);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      } else {
        $scope.selection.push(palabras);
      }

      $scope.textoBuscando = '<p>KILL-9 ESTA BUSCANDO POSIBLES OBJETIVOS<span>|</span></p>';
      var timeTexto = $timeout(function() {
        buscarTweets($scope.selection);
      }, 3500);  

      function buscarTweets(palabras){
        var cajaUser = [];
        $http.get('/api/patron/'+palabras).success(function(listaUsuarios) {
          for (var i = listaUsuarios.length - 1; i >= 0; i--) {
            cajaUser.push(listaUsuarios[i].id);
          };
          $scope.listaUsuarios = listaUsuarios;
          $scope.textoAlgoritmo = '<p>KILL-9 ALGORITMO ANALIZANDO TWEETS<span>|</span></p>';
          var timeRecoger = $timeout(function() {
            recogerTweets(cajaUser);
          }, 3000);
        });
      }

      function recogerTweets(listaUsuarios){

        $http.get('/api/recogerTweets/'+listaUsuarios).success(function(resAlgoritmo) {
          console.log(resAlgoritmo);
          $scope.resultadoAlgoritmo = resAlgoritmo;
          $scope.total = resAlgoritmo.length;
          console.log(resAlgoritmo.length);
          if(resAlgoritmo.length == 0){
            console.log('res');
            $scope.textoAlgoritmo = '<p>KILL-9 NO MATCH <span>|</span></p>';
          }else{
            $scope.textoObjetivos = '<p>KILL-9 GENERANDO LISTA DE OBJETIVOS <span>|</span></p>';
          }
          var timeout = $timeout(function(){
            $scope.objetivos = resAlgoritmo;
          }, 3000);
        });
      }
    }    
  });
