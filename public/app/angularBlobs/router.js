angular.module('angularBlobs')
.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/app/angularBlobs/views/blobs.html',
			controller: 'BlobsController'
		})
		.when('/:id', {
			templateUrl: '/app/angularBlobs/views/blobDetails.html',
			controller: 'BlobDetailsController'
		});
	}]);
