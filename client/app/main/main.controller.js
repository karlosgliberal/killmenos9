'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, $interval, $sce, hotkeys) {
  
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
    $scope.porcentaje = 0;
    

    hotkeys.add({
      combo: 'a',
      description: 'Palabra a',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[0].name);
      }
    });
    hotkeys.add({
      combo: 's',
      description: 'Palabra s',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[1].name);
      }
    });
    hotkeys.add({
      combo: 'd',
      description: 'Palabra d',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[2].name);
      }
    });
    hotkeys.add({
      combo: 'f',
      description: 'Palabra f',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[3].name);
      }
    });
    hotkeys.add({
      combo: 'g',
      description: 'Palabra g',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[4].name);
      }
    });
    hotkeys.add({
      combo: 'h',
      description: 'Palabra h',
      callback: function() {
        $scope.buscarPatron($scope.listaPalabras[5].name);
      }
    });

    var stop;
    $scope.contadorPorcentaje = function contadorPorcentaje() {
      // Don't start a new fight if we are already fighting
      if ( angular.isDefined(stop) ) return;

      stop = $interval(function() {
        if ($scope.porcentaje != 100) {
          $scope.porcentaje = $scope.porcentaje + 2;
        } else {
          $scope.stopContadorPorcentaje();
        }
      }, 100);
    };

    $scope.stopContadorPorcentaje = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };


    $scope.$on('$destroy', function() {
      $scope.stopContadorPorcentaje();
    });

    $scope.buscarPatron = function buscarPatron(palabras){

      var timePorcentaje = $timeout(function() {
        $scope.contadorPorcentaje();
      }, 1500);
      var idx = $scope.selection.indexOf(palabras);
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
          $scope.porcentaje = 100;
          $scope.listaUsuarios = listaUsuarios;
          $scope.textoAlgoritmo = '<p>KILL-9 ALGORITMO ANALIZANDO TWEETS<span>|</span></p>';
          var timeRecoger = $timeout(function() {
            recogerTweets(cajaUser);
          }, 3000);
        });
      }

      function recogerTweets(listaUsuarios){


        $http.get('/api/recogerTweets/'+listaUsuarios).success(function(resAlgoritmo) {
          $scope.resultadoAlgoritmo = resAlgoritmo;
          $scope.total = resAlgoritmo.length;
          if(resAlgoritmo.length == 0){
            $scope.textoAlgoritmo = '<p>KILL-9 NO MATCH <span>|</span></p>';
            var timeoutNomatch = $timeout(function(){
              $scope.textoAlgoritmo = '<p>KILL-9 REBOOT... <span>|</span></p>';
            }, 3000);
            var timeoutRestart = $timeout(function(){
              $window.location.reload();
            }, 6000);

          }else{
            $scope.textoObjetivos = '<p>KILL-9 GENERANDO LISTA DE OBJETIVOS <span>|</span></p>';
            var timePreparando = $timeout(function() {
              $scope.textoDrone = '<p>KILL-9 ENVIANDO DRONES HACIA LOS OBJETIVOS<span>|</span></p>';
            }, 2000);
            var timeDrones = $timeout(function() {
              $scope.textoDrone = '';
              $scope.videoObjeto = $sce.trustAsHtml('<video width="420" autoplay><source src="/assets/video/drone.mp4" type="video/mp4"></video>');
            }, 4000);

          }
          var timeoutSacarObjetivos = $timeout(function(){
            $scope.objetivos = resAlgoritmo;
          }, 9000);
        });
      }
    }    
  });
