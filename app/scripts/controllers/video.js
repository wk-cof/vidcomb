'use strict';

/**
 * @ngdoc function
 * @name videoDayHackApp.controller:VideoCtrl
 * @description
 * # VideoCtrl
 * Controller of the videoDayHackApp
 */
angular.module('videoDayHackApp')
  .controller('VideoCtrl', function ($scope, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.routeParams = $routeParams;
  });
