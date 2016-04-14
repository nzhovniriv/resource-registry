(function(){

    'use strict';

    angular
        .module('restApp')
        .factory('RestService', RestService);

        RestService.$inject = ['$http','$location','$route'];
        function RestService($http, $location, $route) {

            var serviceBase = '/rest.php/';
            var obj = {};

            obj.getData = function(restQuery){
                return $http.get(serviceBase + restQuery);
            };

            obj.createData = function (dataObj, restQuery) {
                return $http.post(serviceBase + restQuery, dataObj);
            };

            obj.getDataById = function(dataId, restQuery){
                return $http.get(serviceBase + restQuery + '/' + dataId);
            };

            obj.updateData= function (dataObj, dataId, restQuery) {
                return $http.put(serviceBase + restQuery + '/'  + dataId, dataObj );
            };

            obj.deleteData = function (dataId, restQuery) {
                return $http.delete(serviceBase + restQuery + '/' + dataId);
            };

            return obj;
        }
})();