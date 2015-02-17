'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http) {
  
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
        console.log(palabras);
        $http.get('/api/patron/'+palabras).success(function(listaUsuarios) {
          console.log(listaUsuarios);
          $scope.listaUsuarios = listaUsuarios;
          recogerTweets(listaUsuarios)
        });
      }

      function recogerTweets(listaUsuarios){
        $http.get('/api/recogerTweets/'+listaUsuarios).success(function(resultadoAlgoritmo) {
          console.log(resultadoAlgoritmo);
          $scope.resultadoAlgoritmo = resultadoAlgoritmo;
        });
      }
    }    
  });
