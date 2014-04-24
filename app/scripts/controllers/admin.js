'use strict';

/* Controllers */

angular.module('myApp.controllers.admin', [])

   .controller('AdminCtrl', ['$scope' ,'syncData', '$firebaseSimpleLogin', 'FBURL', function($scope, syncData, $firebaseSimpleLogin, FBURL) {
      $scope.newMake = null;
      $scope.makes = syncData('makes');
      $scope.addMake = function() {
         if ($scope.newMake) $scope.makes.$add($scope.newMake);
      };
      $scope.delete = function(make) {
         $scope.makes.$remove(make.$id);
      };
   }]);