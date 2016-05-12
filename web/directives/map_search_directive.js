(function () {

	'use strict';

	angular.module('restApp').directive("leafletMapSearch", function ($http) {
							
							
		// var resources = [];

		// $http.get('rest.php/resources/gettingdata?min_lat=49.74515828373593&max_lat=49.92516008373593&min_lng=23.86005065094529&max_lng=24.13900235045852')
		// 	   .then(successHandler)
		// 	   .catch(errorHandler);
		// function successHandler(data) {
		// 	   resources = data.data;
		// }
		// function errorHandler(data){
		// 	   console.log("Can't reload list!");
		// }

		// setTimeout(function(){
		// 	console.dir(resources);
		// }, 500);


		var link = function ($scope, $element, attrs, $rootScope, $http) {

			

			var defaults = {
				height: '500px',
				width: '500px',
				position: {
					lat: 49.900,
					lng: 24.8467,
					zoom: 10
				}
			};

			$scope.resourcesWithNames = [];

			$scope.mapCreated = false;
			$scope.resourcesGeoJsonOn = false;

			// Map init

			$scope.updateMapView = function (position, zoom) {
				position = angular.fromJson(position);
				$scope.map.setView(position, zoom);
			};

			$scope.createMap = function () {
				if (!$scope.mapCreated) {
					$('#map-search').show();
					$scope.map = L.map('map-search');

					$scope.baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						minZoom: 5,
						maxZoom: 19
					});
					$scope.baseLayer.addTo($scope.map);

					initMapElements();

					$scope.updateMapView($scope.center, $scope.center.zoom);

					if (attrs.noupdate !== "true" && "geolocation" in navigator) {
						navigator.geolocation.getCurrentPosition(function (position) {
							$scope.geolocation = {
								lat: position.coords.latitude,
								lng: position.coords.longitude,
								zoom: 15
							};
							$scope.updateMapView($scope.geolocation, $scope.geolocation.zoom);
						});
					}

					$scope.mapCreated = true;
				}
			};

			$scope.removeMap = function () {
				if ($scope.mapCreated) {
					if ($scope.coordinates === 'true')
						$scope.coordinates.removeFrom($scope.map);
					if ($scope.info === 'true')
						$scope.info.removeFrom($scope.map);
					if ($scope.add === 'true')
						$scope.drawControl.removeFrom($scope.map);

					$scope.map.remove();
					$('#map-search').hide();

					$scope.mapCreated = false;
				}
			};

			$scope.toggleMap = function () {
				if ($scope.mapCreated) {
					$scope.removeMap();
				} else {
					$scope.createMap();
				}
			};

			if (attrs.toggledon === 'true') {
				$scope.createMap();
			}

			$scope.$watch('options.showPolygonOnMap.showPolygon', function (val) {
				console.log(val);
				if ($scope.mapCreated && val) {
					$scope.options.showPolygonOnMap.latlngs = angular.fromJson($scope.options.showPolygonOnMap.latlngs);
					var polygon = L.polygon($scope.options.showPolygonOnMap.latlngs);
					$scope.map.fitBounds(polygon.getBounds());

					if ($scope.geoJsonLayer)
						$scope.map.removeLayer($scope.geoJsonLayer);
					$scope.geoJsonLayer = L.geoJson(L.polygon($scope.options.showPolygonOnMap.latlngs).toGeoJSON(), {
						style: style,
						onEachFeature: infoOnEachFeature
					}).addTo($scope.map);
					$scope.options.showPolygonOnMap.showPolygon = false;
				}
			});

			$scope.$watch('options.toggleMap', function (val) {
				if (val) {
					$scope.toggleMap();
					$scope.options.toggleMap = false;
				}
			});

			$scope.$watch('options.resources.showResources', function (val) {
				if (val) {
					if ($scope.resourcesGeoJsonOn == true) {
						for (var i = 0; i < $scope.resourcesGeoJson.length; i++) {
							$scope.map.removeLayer($scope.resourcesGeoJson[i]);
						}
						$scope.resourcesGeoJsonOn = false;
					}
					$scope.resourcesGeoJson = [];
					for (var i = 0; i < $scope.options.resources.objects.length; i++) {
						console.log($scope.options.resources.objects);
						var geojson = L.polygon(JSON.parse($scope.options.resources.objects[i].coordinates)).toGeoJSON();
						geojson.properties.name = $scope.options.resources.objects[i].name;
						var resource = L.geoJson(geojson, {
							style: styleResource,
							onEachFeature: resourceOnEachFeature
						});
						resource.addTo($scope.map);
						$scope.resourcesGeoJson.push(resource);
					}
					$scope.resourcesGeoJsonOn = true;
					// $scope.options.resources.showResources = false;
				}
			});

			$scope.$watch('options.resources.hideResources', function (val) {
				if (val) {
					if ($scope.resourcesGeoJsonOn == true) {
						for (var i = 0; i < $scope.resourcesGeoJson.length; i++) {
							$scope.map.removeLayer($scope.resourcesGeoJson[i]);
						}
						$scope.resourcesGeoJsonOn = false;
					}
				}
			});


			function initMapElements() {

				initCssProperties();
				initCoordinatesElement();
				initInteractivity();
				initAdding();
				initSearch();
				initGeojson();

				L.easyButton('glyphicon-star', 
	              function () {
	              	$scope.options.resources.center = $scope.map.getCenter();
	              	$scope.options.resources.getResources = true;
	              	console.log($scope.options.resources);
	              	$scope.$apply();
	              }, '').addTo($scope.map);

				function initCssProperties () {
					$('#map-search').css({ 'height': attrs.height || defaults.height });
					$('#map-search').css({ 'width': attrs.width || defaults.width });
				}

				function initCoordinatesElement () {
					if (attrs.coordinates === 'true') {
						$scope.coordinates = L.control.coordinates();
						$scope.coordinates.addTo($scope.map);
					}
				}

				function initInteractivity () {
					if (attrs.interactivity === 'false') {
						$scope.map.dragging.disable();
						$scope.map.touchZoom.disable();
						$scope.map.doubleClickZoom.disable();
						$scope.map.scrollWheelZoom.disable();
						$scope.map.boxZoom.disable();
						$scope.map.keyboard.disable();

						if ($scope.map.tap)
							$scope.map.tap.disable();

						$('#map-search').css({ 'cursor': 'default' });
						$(".leaflet-control-zoom").css("visibility", "hidden");

					}
				}

				function initAdding () {

					// Controlls localisation

					L.drawLocal.draw.toolbar.actions.title = 'Відмінити створювання';
					L.drawLocal.draw.toolbar.actions.text = 'Відмінити';

					L.drawLocal.draw.toolbar.undo.title = 'Видалити останню точку';
					L.drawLocal.draw.toolbar.undo.text = 'Видалити останню точку';

					L.drawLocal.draw.toolbar.buttons.polygon = 'Створити багатокутник';
					L.drawLocal.draw.toolbar.buttons.rectangle = 'Створити прямокутник';

					L.drawLocal.draw.handlers.polygon.tooltip.start = 'Натисніть на карту, щоб почати створювати багатокутник';
					L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Натисніть на карту, продовжити створювати багатокутник';
					L.drawLocal.draw.handlers.polygon.tooltip.end = 'Натисніть на першу точку, щоб закінчити створювати багатокутник';

					L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Натисніть і потягніть, щоб створити прямокутник';

					L.drawLocal.edit.toolbar.actions.save.title = 'Зберегти зміни';
					L.drawLocal.edit.toolbar.actions.save.text = 'Зберегти';

					L.drawLocal.edit.toolbar.actions.cancel.title = 'Відмінити. Видаляє усі зміни';
					L.drawLocal.edit.toolbar.actions.cancel.text = 'Відмінити';

					L.drawLocal.edit.toolbar.buttons.edit = 'Редагувати об\'єкт';
					L.drawLocal.edit.toolbar.buttons.editDisabled = 'Відсутні об\'єкти для редагування';
					L.drawLocal.edit.toolbar.buttons.remove = 'Видалити об\'єкт';
					L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Відсутні об\'єкти для видалення';

					L.drawLocal.edit.handlers.edit.tooltip.text = 'Переміщайте точки для редагування';

					L.drawLocal.edit.handlers.remove.tooltip.text = 'Натисніть на об\'єкт для видалення';

					if (attrs.add === 'true') {
						$scope.drawnItems = new L.FeatureGroup();
						$scope.map.addLayer($scope.drawnItems);

						$scope.drawControl = new L.Control.Draw({
							draw: {
								polyline: false,
								marker: false,
								circle: false,
								polygon: {
									shapeOptions: {
										color: '#A52A2A'
									}
								}
							},
							edit: {
								featureGroup: $scope.drawnItems,
								edit: false,
								remove: false
							}
						});
						$scope.map.addControl($scope.drawControl);

						$scope.map.on('draw:created', function (e) {
							var type = e.layerType;
							$scope.drawnItem = e.layer;

							$scope.bind = $scope.drawnItem._latlngs;

							$scope.options.created = true;
							var i;
							for (i in $scope.bind) {
								$scope.bind[i].lat = parseFloat($scope.bind[i].lat);
								$scope.bind[i].lng= parseFloat($scope.bind[i].lng);
							}
							$scope.options.newCoords = $scope.bind;
							if ($scope.geoJsonLayer)
								$scope.map.removeLayer($scope.geoJsonLayer);
							$scope.geoJsonLayer = L.geoJson($scope.drawnItem.toGeoJSON(), {
								style: style,
								onEachFeature: infoOnEachFeature
							}).addTo($scope.map);
							$scope.$apply();
						});

						$scope.map.on('draw:drawstart', function() {
							if ($scope.drawnItem) {
								$scope.drawnItems.removeLayer($scope.drawnItem);
								$scope.$apply();
							}
						});

						$scope.map.on('draw:deleted', function() {
							$scope.bind = {};
							$scope.$apply();
						});

						$scope.map.on('draw:editstop', function() {
							$scope.bind = $scope.drawnItem._latlngs;
							$scope.$apply();
						});



						$scope.map.on('click', function(click) {
							$scope.clickData = [click.latlng.lat, click.latlng.lng];
							console.log($scope.clickData);
							$scope.coordCompare = {
								'44' : 80.208,
								'45' : 78.848,
								'46' : 77.465,
								'47' : 76.057,
								'48' : 74.627,
								'49' : 73.173,
								'50' : 71.697,
								'51' : 70.199,
								'52' : 68.679
							};
							$scope.range = 10;
							$rootScope.y1 = $scope.clickData[0] - (0.00900009 * $scope.range);
							$rootScope.y2 = $scope.clickData[0] + (0.00900009 * $scope.range);
							$rootScope.x1 = $scope.clickData[1] - ((1 / $scope.coordCompare[Math.round($scope.clickData[0])]) * $scope.range);
							$rootScope.x2 = $scope.clickData[1] + ((1 / $scope.coordCompare[Math.round($scope.clickData[0])]) * $scope.range);
							console.log($rootScope.y1, $rootScope.y2, $rootScope.x1, $rootScope.x2);

							// $scope.resources = [];

						
							// $http.get('rest.php/resources/gettingdata' + $rootScope.y1 + '&max_lat=' + $rootScope.y2 + '&min_lng=' + $rootScope.x1 + '&max_lng=' + $rootScope.x2)
							// 	   .then(successHandler)
							// 	   .catch(errorHandler);
							// function successHandler(data) {
							// 	   $scope.resources = data.data;
							// }
							// function errorHandler(data){
							// 	   console.log("Can't reload list!");
							// }
							$scope.xmlData = [];
							$scope.xmlData.length = 0;
							$.get( 'rest.php/resources/gettingdata?min_lat=' + $rootScope.y1 + '&max_lat=' + $rootScope.y2 + '&min_lng=' + $rootScope.x1 + '&max_lng=' + $rootScope.x2, function(data) {
							  	$scope.xmlData = data;
							  	var resources = [];
							  
								for (var i = 0; i < $scope.xmlData.length; i++) {
									var cache = $scope.xmlData[i].coordinates;
									resources.push(JSON.parse(cache));
									$scope.resourcesWithNames.push($scope.xmlData[i].name);

								}
								console.log($scope.resourcesWithNames);

								/*radius of circle*/
								var radius = 5000;

								/*array for markers*/
								var marker = [];

								/*latitude and longitude(the centroid of a closed polygon)*/
								var items = [];

								/*definition of the centroid of a closed polygon*/		
								function getCentroid(arr) {
								    var twoTimesSignedArea = 0;
								    var cxTimes6SignedArea = 0;
								    var cyTimes6SignedArea = 0;

								    var length = arr.length

								    var x = function (i) { return arr[i % length][0] };
								    var y = function (i) { return arr[i % length][1] };

								    for ( var i = 0; i < arr.length; i++) {
								        var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
								        twoTimesSignedArea += twoSA;
								        cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
								        cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
								    }
								    var sixSignedArea = 3 * twoTimesSignedArea;
								    return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];        
								}

								/*pushing coordinates into array(items)*/
								function fillItems(array) {
									for(var i = 0; i < array.length; i++){
										items.push(getCentroid(array[i]));
									}
								}

								/*pushing items into array(marker) each by each and then add markers*/
								function itemWrap(array) {
									for(var i = 0; i < array.length; i++){
									    var LamMarker = new L.marker([array[i][0], array[i][1]]);
									    marker.push(LamMarker);
								    }
								}

								fillItems(resources);

								itemWrap(items);

								/*getting the radius of circle*/
								function getRadius() {
									var input = document.getElementById('radius');
					            	input.oninput = function() {
					            		var value = parseInt(input.value);
					            		if(!isNaN(value)){
					            			radius = value;
					            		}
					            	};
								}

								/*drawing circle*/
								var circle = L.circle(L.latLng(49.85, 24.0166666667), radius, {
								    opacity: 1,
								    weight: 1,
								    fillOpacity: 0
								});

								/*array for resources on map*/
								var resourcesOnMap = [];
								
								/*deleting resources from the map*/
								function deleteResources(resources) {
								    if(resources.length == 0) return;
								    for(var i = 0; i < resources.length; i++){
								    	$scope.map.removeLayer(resources[i]);
								    }
								    resources.length = 0;
								}

								/*showing resources on the map*/
								function showResources(resources) {
								    if(resources.length == 0) return;
								    for(var i = 0; i < resources.length; i++){
								    	$scope.map.addLayer(resources[i]);
								    }
								}

								$scope.map.on('mousemove', function(e) {
								    //getRadius();
								    circle.setRadius(radius);
								    circle.setLatLng(e.latlng);
								    circle.addTo($scope.map);
								    deleteResources(resourcesOnMap);

								   	for(var i = 0; i < marker.length; i++){
								   		var distance = e.latlng.distanceTo(L.latLng(marker[i]._latlng.lat, marker[i]._latlng.lng));
								   		if(distance <= radius){
								    		$scope.map.addLayer(marker[i].bindPopup("Hello!"));

								    		for(var j = 0; j < resources.length; j++){
								    			if(getCentroid(resources[j])[0] == marker[i]._latlng.lat && getCentroid(resources[j])[1] == marker[i]._latlng.lng){
								    				resourcesOnMap.push(L.polygon(resources[j]));
								    				//map.addLayer(L.polygon(resources[j]));
								    			}
								    		}
								    		showResources(resourcesOnMap);
									    }else{
									    	$scope.map.removeLayer(marker[i]);
									    }
								   	}
								});

							});
						});


					}
				}

				function initSearch () {
					
					$scope.map.addControl( new L.Control.Search({
						url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
						jsonpParam: 'json_callback',
						propertyName: 'display_name',
						propertyLoc: ['lat','lon'],
						textPlaceholder: 'Шукати...',
						textCancel: 'Відмінити',
						textErr: 'Не знайдено',
						circleLocation: false,
						markerLocation: true,			
						autoType: false,
						autoCollapse: true,
						minLength: 2,
						zoom:10
					}) );

				}

				function initGeojson () {
					if ($scope.geojson) {
						$scope.geoJsonLayer.addData($scope.geojson);
					}
				}
			}

			// GeoJson objects styling functions

			function style(feature) {
				return {
					fillColor: '#FD8D3C',
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7
				};
			}

			function styleResource(feature) {
				return {
					fillColor: '#008000',
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7
				};
			}

			function infoHighlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});
			}

			function infoResetHighlight(e) {
				$scope.geoJsonLayer.resetStyle(e.target);
			}

			function infoZoomToFeature(e) {
				$scope.map.fitBounds(e.target.getBounds());
			}

			function infoOnEachFeature(feature, layer) {
				layer.on({
					mouseover: infoHighlightFeature,
					mouseout: infoResetHighlight,
					click: infoZoomToFeature
				});
			}

			function resourceOnEachFeature(feature, layer) {
				layer.bindPopup(feature.properties.name);
			}

			// GeoJson functions

			function toGeoJSON(pointsArray) {
				var geojson = {};
				geojson['type'] = 'FeatureCollection';
				geojson['features'] = [];
				var newFeature = {
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": []
					},
					"properties": {
						"title": "",
						"description":""
					}
				};

				for (var pointIndex in pointsArray) {
					var array = [parseFloat(pointsArray[pointIndex].lat), parseFloat(pointsArray[pointIndex].lng)];
					newFeature.geometry.coordinates.push(array);
				}
				geojson['features'].push(newFeature);
				return geojson;
			}

			function toggleResources () {
				$scope.options.resources.showResources = true;
			}
		};

		return {
			restrict: 'E',
			templateUrl: 'directives/map-directive-tpl.html',
			controller: 'searchingCtrl',
			scope: {
				bind: '=bind',
				options: '=update'
			},
			link: link
		};

	});



})();
