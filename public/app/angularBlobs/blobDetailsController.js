angular.module('angularBlobs').controller('BlobDetailsController', ['$scope', '$http', '$routeParams', 'Blobs', '$location', function ($scope, $http, $routeParams, Blobs, $location) {
		$http.get('/blobs/' + $routeParams.id)
		.success(function (data) {
			$scope.blob = data;
		}).error(function (data, status) {
			console.log(data, status);
			$scope.blob = [];
		});
	}]);