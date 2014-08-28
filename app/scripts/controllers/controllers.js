'use strict';

/* Controllers */

angular.module('mcLog.controllers', [])
	.controller('HomeCtrl', ['$scope', 'syncData', '$timeout', function($scope, syncData, $timeout) {
		$scope.activeModel = {};
		$scope.newMake = null;
		$scope.machines = syncData('users/' + $scope.auth.user.uid + '/machines').$asArray();
		$scope.makes = syncData('makes').$asArray();
		$scope.machineDetailsActive = false;
		$scope.confirmDeleteActive = null;
		
		// add a new machine
		$scope.addNew = function() {
			$scope.activeModel = {};
		};
		// edit an existing machine
		$scope.edit = function(model) {
			$scope.activeModel = model;
			$scope.machineDetailsActive = true;
		};
		// save or update the machine
		$scope.saveModel = function() {
			if ($scope.activeModel.$id) {
				$scope.machines.$save($scope.activeModel);
			} else {
				$scope.machines.$add($scope.activeModel);
			}
			$scope.machineDetailsActive = false;
		};
		// confirm deletion of a machine
		$scope.confirmDelete = function(machine) {
			$scope.confirmDeleteActive = machine;
		};
		// delete a machine
		$scope.deleteModel = function() {
			if (!$scope.confirmDeleteActive) return;
			$scope.machines.$remove($scope.confirmDeleteActive).then(function() {
				$scope.confirmDeleteActive = null;
			});
		};

		$scope.uploadImage = function (image) {
			if (!image.valid) return;
			var imagesRef = syncData('images');
			var imageUpload = {
				data: image.data,
				thumbnail: image.thumbnail || null,
				name: image.filename,
				author: {
					provider: $scope.auth.user.provider,
					id: $scope.auth.user.id
				}
			};
			image.isUploading = true;
			imagesRef.$push(imageUpload).then(function(ref) {
				$timeout(function() {
					$scope.status = 'Your image "' + image.filename + '" has been successfully uploaded!';
					$scope.activeModel.img = ref.name();
					console.log($scope);
					image.isUploading = false;
					image.data = undefined;
					image.filename = undefined;
					$timeout(function() {
						$scope.status = null;
					}, 5000);
				});
			}, function(err) {
				$scope.error = 'The image could not be uploaded: ' + err;
			});
		};
	}])
	.controller('MotorcyleCtrl', ['$scope' ,'syncData', '$routeParams', function($scope, syncData, $routeParams) {
		var defaultValues = {
			date: new Date().toISOString().slice(0,10).replace(/-/g, '-')
		};
		$scope.machineId = $routeParams.machineId;
		$scope.machine = syncData('users/' + $scope.auth.user.uid + '/machines/' + $scope.machineId).$asObject();
		$scope.log = syncData('users/' + $scope.auth.user.uid + '/machines/' + $scope.machineId + '/log').$asArray();
		$scope.activeEntry = defaultValues;

		// add new log entry to the machine
		$scope.addLog = function() {
			if($scope.activeEntry.task) {
				if ($scope.activeEntry.$id) $scope.log.$save($scope.activeEntry);
				else {
					$scope.log.$add($scope.activeEntry);
				}
				$scope.activeEntry = defaultValues;
			}
		};
		$scope.editEntry = function(entry) {
			$scope.activeEntry = entry;
		};
		$scope.deleteEntry = function(entry) {
			console.log(entry);
			$scope.log.$remove(entry);
		};
	}])