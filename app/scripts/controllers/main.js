'use strict';

/**
 * @ngdoc function
 * @name videoDayHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the videoDayHackApp
 */
angular.module('videoDayHackApp')
  .controller('MainCtrl', function ($scope) {
  	if (!$scope.navbarModel) {
  		$scope.navbarModel = {};
  	}
    $scope.navbarModel.main = true;

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
