/* globals $, Firebase, Stupeflix */
'use strict';

/**
 * @ngdoc function
 * @name videoDayHackApp.controller:VideoCtrl
 * @description
 * # VideoCtrl
 * Controller of the videoDayHackApp
 */
angular.module('videoDayHackApp')
  .controller('VideoCtrl', function (
      $scope, $routeParams, $firebaseObject, $firebaseArray) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.routeParams = $routeParams;
    var url = 'https://glaring-inferno-2666.firebaseio.com/events/';
    url = url + $routeParams.recordID;

    var ref = new Firebase(url);
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, 'data');
    $scope.messages = $firebaseArray(ref);
    setTimeout(function() {
      var videos = $scope.messages;
      for (var i = 0; i < videos.length; ++i) {
        $("#ziggeo-container")
          .append(
            "<ziggeo ziggeo-video='" +
            videos[i].token +
            "'ziggeo-width=320 ziggeo-height=240 ></ziggeo>");
      }
    }, 2000);

    $scope.debug = function() {
      console.log($scope.messages);
      var urls = $scope.messages.map(function(obj) {
        return obj;
      });
      console.log(urls);
      var xml = $scope.createXmlForVideos(urls);
      console.debug(xml);
    };

    $scope.compile = function() {
      var urls = $scope.messages.map(function(obj) {
        return obj;
      });
      var xml = $scope.createXmlForVideos(urls);
      $scope.createVideo(xml);
    };

    $scope.createVideo = function(xmlDefinition) {
      var tasks = new Stupeflix.TaskManager({
        api_key: "7f5qbqde3bf72"
      });
      var task = tasks.create({
        task_name: 'video.create',
        definition: xmlDefinition,
        preview: false,
        export: true,
        profile: '360p',
        thumbnail_time: 1.0
      }).then(function(response){
        // on Success
        $scope.result = response.result;
        $scope.compiledUrl = response.result.export;
        $('#showCompiled').append(
          '<p>Your video is ready! <a href="' +
          $scope.compiledUrl +
          '">Click here to view it</a></p>');
        $('#showCompiled').append(
          '<div><video src="' +
          $scope.compiledUrl +
          '" controls "></video></div>'
        );
        console.log(response);
      }, function(response){
        // on Error
        console.debug(response);
      });
      console.debug(task);
    };

    $scope.createXmlForVideos = function(objs) {
      // objs have url and duration attr
      var templateHead = "<movie service='craftsman-1.0'>\n    <body>";
      var templateTail = "  </body>\n</movie>";
      var fade = "\n    <transition type='crossfade' duration='0.5'/>";
      var videos = objs.map($scope.makeUrlForVideo).join(fade);
      return templateHead + videos + templateTail;
    };

    $scope.makeUrlForVideo = function(obj) {
      var url = obj.url
      var duration = obj.duration || "5.0";
      return "\n    <effect type='none'>" +
          "\n       <video filename='" +
          url +
          "' duration='" + duration + "'/>" +
          "\n    </effect>"
    };

  });
