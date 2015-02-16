'use strict';

angular.module('killmenos9App')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $http.get('/api/tweets').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });


  });
