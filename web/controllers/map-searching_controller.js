(function () {

	angular.module('restApp').controller("searchingCtrl", ["$scope", '$rootScope', '$http', function ($scope, $rootScope, $http) {
		$scope.center = {
			lat: 49.900,
			lng: 24.8467,
			zoom: 6
		};


		$rootScope.options = {
			toggleMap: false,
			showPolygonOnMap: {
				showPolygon: false,
				latlngs: []
			},
			resources: {
				showResources: false,
				objects: [],
				getResources: false
			}
		};

	}]);

})();
