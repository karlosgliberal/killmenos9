'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, $interval, $sce) {
  
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
    

    var stop;
    $scope.fight = function fight() {
      // Don't start a new fight if we are already fighting
      if ( angular.isDefined(stop) ) return;

      stop = $interval(function() {
        if ($scope.porcentaje != 100) {
          $scope.porcentaje = $scope.porcentaje + 2;
        } else {
          $scope.stopFight();
        }
      }, 100);
    };

    $scope.stopFight = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };


    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      $scope.stopFight();
    });

    $scope.buscarPatron = function buscarPatron(palabras){
      var timePorcentaje = $timeout(function() {
        $scope.fight();
      }, 1500);
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
          console.log(resAlgoritmo);
          $scope.resultadoAlgoritmo = resAlgoritmo;
          $scope.total = resAlgoritmo.length;
          console.log(resAlgoritmo.length);
          if(resAlgoritmo.length == 0){
            console.log('res');
            $scope.textoAlgoritmo = '<p>KILL-9 NO MATCH <span>|</span></p>';

            var timeout = $timeout(function(){
              $scope.textoAlgoritmo = '<p>KILL-9 REBOOT... <span>|</span></p>';
            }, 3000);

            var timeout = $timeout(function(){
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
          var timeout = $timeout(function(){
            $scope.objetivos = resAlgoritmo;
          }, 9000);
        });
      }
    }    
  });
