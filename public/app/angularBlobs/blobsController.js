angular.module('angularBlobs')
.controller('BlobsController', ['$scope', function ($scope) {
		$scope.blobs =
		[
			{ name: "ABC", badge: "123", dob: new Date() },
			{ name: "Jakub", badge: "123", dob: new Date() },
			{ name: "Aneta", badge: "123", dob: new Date() },
			{ name: "Agata", badge: "123", dob: new Date() },
			{ name: "Bakub", badge: "123", dob: new Date() },
			{ name: "ABC", badge: "123", dob: new Date() },
			{ name: "BCD", badge: "123", dob: new Date() }
		];
	}]);
