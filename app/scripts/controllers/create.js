'use strict';

/**
 * @ngdoc function
 * @name videoDayHackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the videoDayHackApp
 */
angular.module('videoDayHackApp')
  .controller('CreateCtrl', function ($scope, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.navbarModel.create = true;
    $scope.createModel = {
    	targetName: '',
    	title: '',
    	name: '',
    	email: '',
    }
    $scope.submitForm = function () {
    	var mangledName = encodeURIComponent($scope.createModel.targetName + '-' + $scope.createModel.title);
   	  	// var ref = new Firebase('https://glaring-inferno-2666.firebaseio.com/events/' + mangledName);
    	$location.path('/record/' + mangledName);
    }
  });
