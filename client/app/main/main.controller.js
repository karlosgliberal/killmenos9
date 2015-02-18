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

    $scope.myFunct = function teclado(event){
      console.log(event);
    }

    $scope.buscarPatron = function buscarPatron(palabras){
      var idx = $scope.selection.indexOf(palabras);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      } else {
        $scope.selection.push(palabras);
      }

      buscarTweets($scope.selection);

      function buscarTweets(palabras){
        var cajaUser = [];
        $http.get('/api/patron/'+palabras).success(function(listaUsuarios) {
          for (var i = listaUsuarios.length - 1; i >= 0; i--) {
            cajaUser.push(listaUsuarios[i].id);
          };
          recogerTweets(cajaUser);
          $scope.listaUsuarios = listaUsuarios;

        });
      }

      function recogerTweets(listaUsuarios){

        $http.get('/api/recogerTweets/'+listaUsuarios).success(function(resAlgoritmo) {
          console.log(resAlgoritmo);
          $scope.resultadoAlgoritmo = resAlgoritmo;
          $scope.total = resAlgoritmo.length;
          var timeout = $timeout(function(){
            $scope.objetivos = resAlgoritmo;
          }, 3000);
        });
      }
    }    
  });
