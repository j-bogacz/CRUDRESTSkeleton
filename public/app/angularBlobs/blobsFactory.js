angular.module('angularBlobs').factory('Blobs', ['$http', function ($http) {
		var a = $http.get('/blobs');
		return a;
	}]);
