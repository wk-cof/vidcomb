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
if (!$scope.navbarModel) {
  		$scope.navbarModel = {};
  	}
    $scope.navbarModel.record = true;
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.currentRoute = $routeParams;
    window.ROUTE_ID = $routeParams.recordID;
  });
