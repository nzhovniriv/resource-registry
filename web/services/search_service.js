angular.module('restApp')
    .factory("SearchService", SearchService);
    SearchService.$inject = ['$http','$location','$route', '$rootScope', 'constant'];

    function SearchService($http,$location,$route, $rootScope, constant) {
    var obj = {},
    	serviceBase = 'rest.php/';

    obj.getClasses = function(){
        return $http.get(serviceBase + 'resource_classes');
    };

    obj.search = function(str){
        return $http.get(serviceBase + 'searches' + '/search?' + str );
    };
    
    obj.searchResources = function(str){
    	console.log(serviceBase + 'resources' + '/search?' + str);
        return $http.get(serviceBase + 'resources' + '/search?' + str);
    };  

    obj.getResourceByCoordinates = function(str) {
        return $http.get(serviceBase + 'searches' + '/getresourcebycoordinate?center_lat=' + str.lat + '&center_lng=' + str.lng + '&radius=5');
    };
      
    return obj;


    }