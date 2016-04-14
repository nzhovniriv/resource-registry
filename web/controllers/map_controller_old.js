(function () {

	angular.module('restApp').controller("MapCtrl", ["$scope", '$rootScope', function ($scope, $rootScope) {
		$scope.center = {
			lat: 49.900,
			lng: 24.8467,
			zoom: 6
		};

		$scope.options = {
			toggleMap: false,
			coordsToMap: false,
			showOnMapLatlngs: [],
			updateMap: false,
			created: false,
			latlngs: [],
			zoom: 0,
			newCoords: []
		};

		$scope.coordsToMap = function (coordinates) {
			$scope.options.coordsToMap = true;
			$scope.options.showOnMapLatlngs = L.polygon(coordinates);
		};

		$scope.updateMapView = function (coordinates, zoom) {
			$scope.options.updateMap = true;
			$scope.options.latlngs = coordinates;
			$scope.options.zoom = zoom;
		}

		$scope.toggleMap = function () {
			$scope.options.toggleMap = true;
		}

		$scope.$watch('options.created', function(val){

			if(val) {
				$rootScope.coords = [];
				console.log($scope.options.newCoords);
				var i;
				for (i in $scope.options.newCoords) {
					$rootScope.coords.push({lat: $scope.options.newCoords[i].lat, lng: $scope.options.newCoords[i].lng});
				}
				$scope.options.created = false;
				console.log($rootScope.coords);
			}

		});
	}]);

})();
