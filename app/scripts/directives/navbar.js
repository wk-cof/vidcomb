'use strict';

/**
 * @ngdoc directive
 * @name videoDayHackApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('videoDayHackApp')
  .directive('navbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/navbar.html', 
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
      	scope.navbarModel = {
      		main: false,
      		create: false,
      		record: false,
      		video: false
      	}
      	scope.setActive = function ( attr ) {
          // console.log($location.path());
      		scope.navbarModel.main = false;
      		scope.navbarModel.create = false;
      		scope.navbarModel.record = false;
      		scope.navbarModel.video = false;
      		// scope.navbarModel[attr] = true;
      	};
      }
  };
}]);
