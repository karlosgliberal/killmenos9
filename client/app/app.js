'use strict';

angular.module('killmenos9App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'cfp.hotkeys'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });