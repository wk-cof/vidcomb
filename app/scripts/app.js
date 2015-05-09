'use strict';

/**
 * @ngdoc overview
 * @name videoDayHackApp
 * @description
 * # videoDayHackApp
 *
 * Main module of the application.
 */
angular
  .module('videoDayHackApp', [
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/record/:recordID', {
        templateUrl: 'views/record.html',
        controller: 'RecordCtrl'
      })
      .when('/video/:recordID', {
        templateUrl: 'views/video.html',
        controller: 'VideoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
