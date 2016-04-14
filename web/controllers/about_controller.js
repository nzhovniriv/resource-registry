(function(){
    'use strict';
    angular.module('restApp')

        .controller('AboutCtrl', ['$scope','$http','$location','$route', function($scope, $http,$location,$route) {


            /*    var serviceBase = '/rest.php/';
                var obj = {};
                var obj2 = {
            login:'ef1',
                    password:'dffd1',
                    email:'dsfsfd1',
                    user_data_id:1
                };
            var obj3 = {
                last_name: 'vasya1',
                first_name: 'vasya12',
                middle_name: 'vasya31',
                passport_series: 'vs1',
                passport_number: '6662231',
                address: 'vasyaLviv1'
            };



                obj.createUser = function () {
                    return $http.post(serviceBase + 'users', obj2)
                        .then(successHandler)
                        .catch(errorHandler);
                    function successHandler(result) {
                        return $http.post(serviceBase + 'personal_datas', obj3)
                            .catch(errorHandler);
                        //$location.path('/register/index');
                    }
                    function errorHandler(result){
                        alert("Error data");
                        //$location.path('/register/create')
                    }
                };
            obj.createUser();*/




        }]);


})();

