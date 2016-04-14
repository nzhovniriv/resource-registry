(function(){

    'use strict';

    angular
        .module('restApp')
        .factory('RegisterService', RegisterService);

        RegisterService.$inject = ['$http','$location','$route'];
        function RegisterService($http, $location, $route) {
            var serviceBase = '/rest.php/';
            var obj = {};

            obj.createUser = function (register) {
                return $http.post(serviceBase + 'resources', register)
                    .then(successHandler)
                    .catch(errorHandler);
                function successHandler(result) {
                    $location.path('/register/index');
                }
                function errorHandler(result){
                    alert("Error data");
                    $location.path('/register/create')
                }
            };
            return obj;
        }
})();