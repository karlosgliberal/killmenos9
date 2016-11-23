'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http, $timeout, $window, $interval, $sce, hotkeys, $routeParams, ngDialog) {

    $scope.listaPalabras = [
      {name:"pamplona", id:1, clase:'metadato-palabra', letra:'a'},
      {name:"desahucios", id:2, clase:'metadato-palabra', letra:'s'},
      {name:"crisis", id:3, clase:'metadato-palabra', letra:'d'},
      {name:"ramplona", id:5, clase:'metadato-palabra', letra:'f'},
      {name:"madrid", id:6, clase:'metadato-palabra', letra:'g'},
    ];

    $scope.listaUsuarios = [];
    $scope.selection=[];
    $scope.resultadoAlgoritmo = [];
    $scope.objetivos = [];
    $scope.porcentaje = 0;
    $scope.controlEjecutar = 0;

    var timeMantenimineto = $timeout(function(){
      errorDialog('KILL -9 SESION TERMINADA: MANTENIMIENTO');
    }, 300000);


    function killHotKey(){
      for (var i = $scope.listaPalabras.length - 1; i >= 0; i--) {
        hotkeys.add({
          combo: $scope.listaPalabras[i].letra,
          description:$scope.listaPalabras[i] ,
          callback: function(data, hotkey) {
            hotkey.description.clase = 'metadato-activo';
            $scope.buscarPatron(hotkey.description.name);
          }
        });
      };
    }
    killHotKey();

    hotkeys.add({
      combo: 'z',
      description: 'ejecutar',
      callback: function() {
        $scope.ejecutar();
      }
    });

    hotkeys.add({
      combo: 'c',
      description: 'reset',
      callback: function() {
        $scope.reset();
      }
    });

    hotkeys.add({
      combo: 'x',
      description: 'misil',
      callback: function() {
        $scope.misil();
      }
    });

    $scope.misil = function ejecutar(){
      errorDialog('ERROR BOTON MISIL ACTIVADO, DESACTIVAR<br><div class="img-center"><img src="assets/images/missile-error-verde.gif"></div>');
    };

    $scope.reset = function reset(){
      errorDialog('ERROR DEMASIADAS SELECCIONES');
    };

    $scope.msg = '<p>MSG<span>_</span></p>'

    function errorDialog(message){
      $scope.errorMesaje = '<p class="mensaje-modal">'+ message +'<span>|</span></p>';
      var dialog = ngDialog.open({
        template: 'errorKill',
        className: 'ngdialog-theme-kill',
        scope: $scope
      });
      $http.get('/api/estado/cambiar').success(function(estado) {
        console.log(estado);
      });
      var timeTexto = $timeout(function() {
        $window.location.reload();
      }, 5500);
    }

    function misilDialog(message){
      $scope.errorMesaje = '<p class="mensaje-modal">'+ message +'<span>|</span></p>';
      $scope.misilDialog = ngDialog.open({
        template: 'misilKill',
        className: 'ngdialog-theme-kill',
        scope: $scope
      });
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

      if($scope.selection.length >= 4){
        errorDialog('KILL-9 ERROR MIN 4 WORD, REBOOT...');
      }else{
        $scope.msg = '<p>LOCALIZANDO USUARIOS QUE HAN USADO LAS PALABRAS SELECCIONADAS <span>_</span> </p>';
        var timeRecoger = $timeout(function() {
          buscarTweets($scope.selection);
        }, 7000);
      }
    }

    function buscarTweets(palabras){
      var cajaUser = [];
      $http.get('/api/patron/'+palabras).success(function(listaUsuarios) {
        if(listaUsuarios.length == 0){
          errorDialog('KILL -9 PALABRAS NO COMBINADAS, REBOOT...');
        }
        for (var i = listaUsuarios.length - 1; i >= 0; i--) {
          cajaUser.push(listaUsuarios[i].id);
        };
        $scope.porcentaje = 100;
        $scope.listaUsuarios = listaUsuarios;
        $scope.msg = '<p>ANALIZANDO TWEETS<span>|</span></p>';
        var timeRecoger = $timeout(function() {
          $scope.msg = '<p>COMPARANDO TWEETS CON NUESTRO ALGORITMO, BUSCANDO COINCIDENCIAS <span>|</span></p>';
          var timeRecoger = $timeout(function() {
            recogerTweets(cajaUser);
          }, 7000);
        }, 7000);
      });
    }

    function recogerTweets(listaUsuarios){
      $http.get('/api/recogerTweets/'+listaUsuarios).success(function(resAlgoritmo) {
        $scope.resultadoAlgoritmo = resAlgoritmo;
        $scope.total = resAlgoritmo.length;
        if(resAlgoritmo.length == 0){
          errorDialog('KILL-9 NO MATCH REBOOT...');
        }else{
          $scope.msg = '<p>KILL-9 GENERANDO LISTA DE OBJETIVOS <span>|</span></p>';
          var timePreparando = $timeout(function() {
            $scope.msg = '<p>KILL-9 ENVIANDO DRON HACIA EL OBJETIVO<span>|</span></p>';
          }, 9000);
          var timeDrones = $timeout(function() {
            $scope.videoObjeto = $sce.trustAsHtml('<img src="/assets/images/dron.gif" width="374px">');
          }, 8000);
          var timeMisilDialog = $timeout(function(){
            misilDialog('MUERTE Y DESTRUCCIÓN<br><div class="img-center"><img src="assets/images/missile-error-verde.gif"></div>');
          }, 14000);
        }
        var timeoutSacarObjetivos = $timeout(function(){
          $scope.objetivos = resAlgoritmo;
        }, 11000);
      });
    }

    $scope.ejecutar = function ejecutar(){
      if($scope.controlEjecutar  == 0){
        $scope.ejecutar = 1;
        if($scope.objetivos.length == 0){
          $scope.textoBuscando = '<p>KILL-9 ERROR NO TARGET, REBOOT.. <span>|</span></p>';
          var timeTexto = $timeout(function() {
            errorDialog('<p>KILL-9 ERROR NO TARGET, REBOOT.. <span>|</span></p>');
          }, 4000);
        }else{
          $scope.misilDialog.close();
          var randNumber = Math.floor((Math.random() * $scope.objetivos.length  ) + 0);
          $scope.msg = '<p>KILL-9 OBJETIVO SELECIONADO <span>|</span></p>';
          var timeseleccionado = $timeout(function() {
            $scope.objetivos[randNumber].clase = 'blink eliminar';
          }, 5000);
          var timeseleccionado = $timeout(function() {
            $scope.generarImagen($scope.objetivos[randNumber]);
          }, 5000);
        }
      }
    }

    $scope.generarImagen = function generarImagen(obj){
      var objeto = angular.toJson(obj);
      var parametro =
      $http
        .get('/api/images/crear', {
        params: {
            name: obj.name,
            id: obj.id,
            fraseOrig: obj.fraseOrig,
            palabras: obj.palabras,
            patron: $scope.selection,
            fecha: obj.fecha
        }
     })
     .success(function (data) {
       $scope.notificacionImg = data.name;
       var timeDialog = $timeout(function(){
        var dialog = ngDialog.open({
          template: 'notificacion',
          overlay: false,
          showClose: false,
          className: 'ngdialog-theme-notificacion',
          scope: $scope
        });
      }, 4000);
       var timeFin = $timeout(function(){
         errorDialog('KILL -9 ENVIO NOTIFICACIóN: REINICIO');
       }, 40000);
     });
    };
  });
