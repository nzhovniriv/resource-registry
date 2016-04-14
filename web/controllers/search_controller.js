/**
 * Created by vitas_000 on 06.10.2015.
 */
(function(){
    'use strict';
    angular.module('restApp')

    .controller('SearchController', SearchController);
    SearchController.$inject = ['$scope', '$http','SearchService', '$rootScope' , 'RestService', 'constant', 'PaginationService'];

    function SearchController($scope, $http, SearchService, $rootScope, RestService, constant, PaginationService) {
        $scope.request = {};


        //Load resource classes
        RestService.getData(constant.resource_classesQuery)
            .then(function(data){
                $rootScope.resource_classes = data.data;
            });


        //Pagination start

        $scope.currentPage = PaginationService.currentPage;

        $scope.getPages = function(pageCount) {
            return PaginationService.getPages(pageCount);
        };



        $scope.switchPage = function(index){
            if($scope.request){
                PaginationService.switchPage(index, constant.resourcesQuery + '/search?' + buildQuery($scope.request)+ '&')
                    .then(function(data){
                        $scope.resources = data.data;
                        $scope.currentPage = PaginationService.currentPage;
                });
            }else {
                PaginationService.switchPage(index, constant.resourcesQuery + '?')
                    .then(function(data){
                        $scope.resources = data.data;
                        $scope.currentPage = PaginationService.currentPage;
                });
            }

        };
        $scope.switchPage($scope.currentPage);

        $scope.setPage = function(pageLink, pageType){
            PaginationService.setPage(pageLink, pageType, $scope.resources._meta.pageCount)
                .then(function(data){
                    $scope.resources = data.data;
                    $scope.currentPage = PaginationService.currentPage;
            });
        };

        //Pagination end

        SearchService.getClasses()
            .then(function(data){
                $scope.classes = data.data;
                //$scope.classes.unshift({class_id: undefined, name:constant.MSG_SELECT_CLASS});
        });

        $scope.search = function(){
            console.log('query:');
            console.log($scope.request);
            //console.log(buildQuery($scope.request));
            if(length($scope.request))
                SearchService.searchResources(buildQuery($scope.request))
                    .then(function(data){
                        $scope.resources = data.data;
                        $rootScope.currentPage = PaginationService.currentPage;
                    });
        };

        $scope.addClassId = function(class_id){
            $scope.request.class_id = class_id;
            $scope.search();
        };

        $scope.cancelSearch = function(){
            $http.get('/rest.php/resources?&per-page=' + constant.perPage)
                .then(function(data){
                    $scope.resources = data.data;
                    $scope.request = {};
            });
        };


        $scope.select = function(elem){
            $scope.selected = elem;
        };
        $scope.selected = {
            elem:null
        };
        $scope.isSelected = function(elem){
            return $scope.selected === elem;
        };

        function buildQuery(query){
            var str = '';
            for(var key in query)
                if( query[key] )
                    str += key + '=' + query[key] + '&';
                    str = str.substr(0, str.length-1);
                    return str;
        }
        function length(obj){
            return Object.keys(obj).length;
        }
    }

})();