'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('HomeCtrl', ['$scope', 'syncData', '$timeout', function($scope, syncData, $timeout) {
		$scope.activeModel = null;
		$scope.newMake = null;
		$scope.machines = syncData('users/' + $scope.auth.user.uid + '/machines').$asArray();
		$scope.makes = syncData('makes').$asArray();
		$scope.machineDetailsActive = false;
		$scope.confirmDeleteActive = null;
		
		$scope.edit = function(model) {
			$scope.activeModel = model;
			$scope.machineDetailsActive = true;
		};
		// save or update the model
		$scope.saveModel = function() {
			if($scope.activeModel) {
				if ($scope.activeModel.$id) {
					$scope.machines.$save($scope.activeModel);
				} else {
					$scope.machines.$add($scope.activeModel);
				}
				// $scope.activeModel = null;
				$scope.machineDetailsActive = false;
			}
		};
		// delete a machine
		$scope.confirmDelete = function($id) {
			$scope.confirmDeleteActive = $id;
		};
		$scope.deleteModel = function() {
			if (!$scope.confirmDeleteActive) return;
			$scope.machines.$remove($scope.confirmDeleteActive);
			$scope.confirmDeleteActive = null;
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
				});
			}, function(err) {
				$scope.error = 'The image could not be uploaded: ' + err;
			});
		};
	}])

	// .controller('ImageUpload', ['$scope', '$log', 'syncData', '$timeout', function ImageUpload($scope, $log, syncData, $timeout) {
		
	// }])

	.controller('MotorcyleCtrl', ['$scope' ,'syncData', '$routeParams', function($scope, syncData, $routeParams) {
		var defaultValues = {
			date: new Date().toISOString().slice(0,10).replace(/-/g, '-')
		};
		$scope.machineId = $routeParams.machineId;
		$scope.machine = syncData('users/' + $scope.auth.user.uid + '/machines/' + $scope.machineId);
		$scope.log = syncData('users/' + $scope.auth.user.uid + '/machines/' + $scope.machineId + '/log');
		$scope.activeEntry = defaultValues;
		$scope.awesomeThings = [0,1,2];

		// add new log entry to the machine
		$scope.addLog = function() {
			if($scope.activeEntry.task) {
				if ($scope.activeEntry.$id) $scope.log.$save($scope.activeEntry.$id);
				else {
					$scope.log.$add($scope.activeEntry);
				}
				$scope.activeEntry = defaultValues;
			}
		};
		$scope.editEntry = function(model) {
			$scope.activeEntry = model;
		};
		$scope.deleteEntry = function($id) {
			$scope.log.$remove($id);
		};
	}])

	.controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
		$scope.email = null;
		$scope.pass = null;
		$scope.confirm = null;
		$scope.createMode = false;

		$scope.login = function(cb) {
			$scope.err = null;
			if( !$scope.email ) {
				$scope.err = 'Please enter an email address';
			}
			else if( !$scope.pass ) {
				$scope.err = 'Please enter a password';
			}
			else {
				loginService.login($scope.email, $scope.pass, function(err, user) {
					$scope.err = err? err + '' : null;
					if( !err ) {
						cb && cb(user);
					}
				});
			}
		};

		$scope.createAccount = function() {
			$scope.err = null;
			if( assertValidLoginAttempt() ) {
				loginService.createAccount($scope.email, $scope.pass, function(err, user) {
					if( err ) {
						$scope.err = err? err + '' : null;
					}
					else {
						// must be logged in before I can write to my profile
						$scope.login(function() {
							loginService.createProfile(user.uid, user.email);
							$location.path('/account');
						});
					}
				});
			}
		};

		function assertValidLoginAttempt() {
			if( !$scope.email ) {
				$scope.err = 'Please enter an email address';
			}
			else if( !$scope.pass ) {
				$scope.err = 'Please enter a password';
			}
			else if( $scope.pass !== $scope.confirm ) {
				$scope.err = 'Passwords do not match';
			}
			return !$scope.err;
		}
	}])

	.controller('AccountCtrl', ['$scope', 'loginService', 'changeEmailService', 'firebaseRef', 'syncData', function($scope, loginService, changeEmailService, firebaseRef, syncData) {
		$scope.syncAccount = function() {
			$scope.user = {};
			syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user').then(function(unBind) {
				$scope.unBindAccount = unBind;
			});
		};
		// set initial binding
		$scope.syncAccount();

		$scope.logout = function() {
			loginService.logout();
		};

		$scope.oldpass = null;
		$scope.newpass = null;
		$scope.confirm = null;

		$scope.reset = function() {
			$scope.err = null;
			$scope.msg = null;
			$scope.emailerr = null;
			$scope.emailmsg = null;
		};

		$scope.updatePassword = function() {
			$scope.reset();
			loginService.changePassword(buildPwdParms());
		};

		$scope.updateEmail = function() {
		  $scope.reset();
		  // disable bind to prevent junk data being left in firebase
		  $scope.unBindAccount();
		  changeEmailService(buildEmailParms());
		};

		function buildPwdParms() {
			return {
				email: $scope.auth.user.email,
				oldpass: $scope.oldpass,
				newpass: $scope.newpass,
				confirm: $scope.confirm,
				callback: function(err) {
					if( err ) {
						$scope.err = err;
					}
					else {
						$scope.oldpass = null;
						$scope.newpass = null;
						$scope.confirm = null;
						$scope.msg = 'Password updated!';
					}
				}
			};
		}
		function buildEmailParms() {
			return {
				newEmail: $scope.newemail,
				pass: $scope.pass,
				callback: function(err) {
					if( err ) {
						$scope.emailerr = err;
						// reinstate binding
						$scope.syncAccount();
					}
					else {
						// reinstate binding
						$scope.syncAccount();
						$scope.newemail = null;
						$scope.pass = null;
						$scope.emailmsg = 'Email updated!';
					}
				}
			};
		}

	}]);