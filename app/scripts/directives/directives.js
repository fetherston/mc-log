'use strict';

/* Directives */


angular.module('myApp.directives', []).
	directive('appVersion', ['version', function(version) {
		return function(scope, elm) {
			elm.text(version);
		};
	}]).
	directive('fbSrc', ['$log', 'syncData', function ($log, syncData) {
		// Used to embed images stored in Firebase
		
		/*
		Required attributes:
			fp-src (The name of an image stored in Firebase)
		*/
		return {
			link: function ($scope, elem, attrs) {
				$scope.$watch(attrs.fbSrc, function(imgId) {
					if (!imgId) return;
					var dataRef = syncData('images/' + imgId).$asObject();
					dataRef.$loaded().then(function() {
						if (dataRef.$id) {
							elem.attr('src', dataRef.data);
						} else {
							$log.log('It appears the image ' + imgId + ' does not exist.');
						}
					});
				});
			},
			restrict: 'A'
		};
	}]).
	directive('fbImageUpload', [function() {
		return {
			link: function(scope, element) {
				// Modified from https://developer.mozilla.org/en-US/docs/Web/API/FileReader
				var fileReader = new FileReader();
				var fileFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
				var wasUploading = false;
				scope.image = {valid: false};
	 
				scope.$watch('image.isUploading', function () {
					var isUploading = scope.image.isUploading;
					if (isUploading && !wasUploading) {
						wasUploading = true;
					}else if (!isUploading && wasUploading) {
						wasUploading = false;
						element.parent().parent()[0].reset();
					}
				});
	 
				fileReader.onload = function (fileReaderEvent) {
					scope.$apply(function () {
						scope.image.data = fileReaderEvent.target.result;
					});
				};

				var loadImage = function(imageInput) {
					if (imageInput.files.length === 0) {
						return;
					}
	 
					var file = imageInput.files[0];
	 
					scope.image.filename = file.name;
	 
					if (!fileFilter.test(file.type)) {
						scope.error = 'You must select a valid image!';
						scope.image.valid = false;
						scope.$apply();
						return;
					} else{
						scope.error = '';
						scope.image.valid = true;
					}
	 
					fileReader.readAsDataURL(file);
					scope.$apply();
				};
	 
				element[0].onchange = function() {
					loadImage(element[0]);
				};
			},
			restrict: 'A'
		};
	}]);
