'use strict';

angular.module('killmenos9App')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/aitor', {
        templateUrl: 'app/aitor/aitor.html',
        controller: 'AitorCtrl'
      });
  });
