
    'use strict';

    angular
        .module('restApp')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$location', '$filter' , '$rootScope', '$scope', '$http', 'PaginationService'];
    function UsersController($location, $filter , $rootScope, $scope, $http, PaginationService) {

        $scope.list_users = [];
        
        (function (){
            return $http.get('rest.php/personal_datas')

                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                $scope.list_users = result.data;
            }
            function errorHandler(result){
                alert(result.data[0].message);
                console.log(result.data[0].message);
            }
        })();

        $scope.sort = function(sort_param){
            console.log($scope.list_users);

            var orderBy = $filter('orderBy');
            $scope.order = function(predicate) {
                console.log(predicate);
                $scope.predicate = predicate;
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : true;
                $scope.list_users = orderBy($scope.list_users, predicate, $scope.reverse);
                console.log("Sorted"+$scope.list_users);
            };
            $scope.order(sort_param, true);
        }
        $scope.filter = function(filter_param){
            var filterBy = $filter('filterBy');
        }
        




    }


