'use strict';

/* Controllers */

angular.module('mcLog.controllers.admin', [])

	.controller('AdminCtrl', ['$scope' ,'syncData', function($scope, syncData) {
		$scope.newMake = null;
		$scope.makes = syncData('makes');
		$scope.addMake = function() {
			if ($scope.newMake) $scope.makes.$add($scope.newMake);
		};
		$scope.delete = function(make) {
			$scope.makes.$remove(make.$id);
		};
	}]);