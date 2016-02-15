angular.module('angularBlobs').controller('BlobsController', ['$scope', 'Blobs', function ($scope, Blobs) {
		Blobs
		.success(function (data) {
			$scope.blobs = data;
		}).error(function (data, status) {
			console.log(data, status);
			$scope.blobs = [];
		});
	}]);
