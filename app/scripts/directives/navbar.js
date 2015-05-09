'use strict';

/**
 * @ngdoc directive
 * @name videoDayHackApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('videoDayHackApp')
  .directive('navbar', function () {
    return {
      templateUrl: '/views/navbar.html', 
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
      	scope.navbarModel = {
      		home: true,
      		create: false,
      		record: false
      	}
      	scope.setActive = function ( attr ) {
      		scope.navbarModel.home = false;
      		scope.navbarModel.create = false;
      		scope.navbarModel.record = false;
      		scope.navbarModel[attr] = true;
      	};
      }
  };
});
