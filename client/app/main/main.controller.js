'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, $interval, $sce, hotkeys, $routeParams, ngDialog) {
  
    $scope.listaPalabras = [
      {name:"pamplona", id:1, clase:'metadato-palabra'},
      {name:"desahucios", id:2, clase:'metadato-palabra'},
      {name:"crisis", id:3, clase:'metadato-palabra'}, 
      {name:"ramplona", id:5, clase:'metadato-palabra'},
      {name:"madrid", id:6, clase:'metadato-palabra'},
    ];

    $scope.listaUsuarios = [];
    $scope.selection=[];
    $scope.resultadoAlgoritmo = [];
    $scope.objetivos = [];
    $scope.porcentaje = 0;
    $scope.controlEjecutar = 0;
    

    hotkeys.add({
      combo: 'a',
      description: 'Palabra a',
      callback: function() {
        $scope.listaPalabras[0].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[0].name);
      }
    });
    hotkeys.add({
      combo: 's',
      description: 'Palabra s',
      callback: function() {
        $scope.listaPalabras[1].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[1].name);
      }
    });
    hotkeys.add({
      combo: 'd',
      description: 'Palabra d',
      callback: function() {
        $scope.listaPalabras[2].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[2].name);
      }
    });
    hotkeys.add({
      combo: 'f',
      description: 'Palabra f',
      callback: function() {
        $scope.listaPalabras[3].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[3].name);
      }
    });
    hotkeys.add({
      combo: 'g',
      description: 'Palabra g',
      callback: function() {
        $scope.listaPalabras[4].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[4].name);
      }
    });
    hotkeys.add({
      combo: 'h',
      description: 'Palabra h',
      callback: function() {
        $scope.listaPalabras[5].clase = 'metadato-activo';
        $scope.buscarPatron($scope.listaPalabras[5].name);
      }
    });
    hotkeys.add({
      combo: 'z',
      description: 'ejecutar',
      callback: function() {
        $scope.ejecutar();
      }
    });

    $scope.msg = '<p>MSG<span>_</span></p>'

    $scope.errorDialog = function errorDialog(message){
      $scope.errorMesaje = '<p class="mensaje-modal">'+ message +'<span>|</span></p>';;
      var dialog = ngDialog.open({
        template: 'errorKill',
        className: 'ngdialog-theme-kill',
        scope: $scope
      });
      var timeTexto = $timeout(function() {
        $window.location.reload();
      }, 5500);
    }

    var stop;
    $scope.contadorPorcentaje = function contadorPorcentaje() {
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

      if($scope.selection.length >= 3){
        $scope.errorDialog('KILL-9 ERROR MIN 2 WORD, REBOOT...');
      }else{
        $scope.msg = '<p>KILL-9 LOCALIZANDO USUARIOS QUE HAN USADO LAS PALABRAS SELECCIONADAS <span>_</span> </p>';
        var timeTexto = $timeout(function() {
          buscarTweets($scope.selection);
        }, 3500);
      }
    }

    function buscarTweets(palabras){
      var cajaUser = [];
      $http.get('/api/patron/'+palabras).success(function(listaUsuarios) {
        console.log(listaUsuarios.length);
        if(listaUsuarios.length == 0){
          $scope.errorDialog('KILL-9 PALABRAS NO COMBINADAS REBOOT...'); 
        }
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
          $scope.errorDialog('KILL-9 NO MATCH REBOOT...');
          $scope.textoAlgoritmo = '<p> <span>|</span></p>';
        }else{
          $scope.textoObjetivos = '<p>KILL-9 GENERANDO LISTA DE OBJETIVOS <span>|</span></p>';
          var timePreparando = $timeout(function() {
            $scope.textoDrone = '<p>KILL-9 ENVIANDO DRONES HACIA LOS OBJETIVOS<span>|</span></p>';
          }, 2000);
          var timeDrones = $timeout(function() {
            $scope.textoDrone = '';
            $scope.videoObjeto = $sce.trustAsHtml('<video width="370" autoplay><source src="/assets/video/drone_small.mp4" type="video/mp4"></video>');
          }, 4000);

        }
        var timeoutSacarObjetivos = $timeout(function(){
          $scope.objetivos = resAlgoritmo;
        }, 9000);
      });
    }

    $scope.ejecutar = function ejecutar(){
      if($scope.controlEjecutar  == 0){
        $scope.ejecutar = 1;
        if($scope.objetivos.length == 0){
          //$scope.textoBuscando = '<p>KILL-9 ERROR NO TARGET, REBOOT... <span>|</span></p>';
          var timeTexto = $timeout(function() {
            //$window.location.reload();
          }, 4000);
        }else{
          var randNumber = Math.floor((Math.random() * $scope.objetivos.length  ) + 0);
          $scope.textoResultadoFin = '<p>KILL-9 OBJETIVO SELECIONADO <span>|</span></p>';
          var timeseleccionado = $timeout(function() {
            $scope.objetivos[randNumber].clase = 'blink eliminar';
          }, 2000);
        }
      }
    }
  });
