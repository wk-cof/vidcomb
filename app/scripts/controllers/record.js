'use strict';

/**
 * @ngdoc function
 * @name videoDayHackApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the videoDayHackApp
 */
angular.module('videoDayHackApp')
  .controller('RecordCtrl', function ($scope, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.currentRoute = $routeParams;
  });
