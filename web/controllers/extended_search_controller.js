(function(){
    'use strict';
    angular.module('restApp')

    .controller('ExtendedSearchController', SearchController);
    SearchController.$inject = ['$scope', '$http','SearchService', '$rootScope' , 'RestService', 'constant', 'PaginationService'];

    function SearchController($scope, $http, SearchService, $rootScope, RestService, constant, PaginationService) {
        $scope.request = {};

        RestService.getData(constant.resource_classesQuery)
            .then(function(data){
                $rootScope.resource_classes = data.data;
            });

        $scope.currentPage = PaginationService.currentPage;

        $scope.getPages = function(pageCount) {
            return PaginationService.getPages(pageCount);
        };

        $scope.switchPage = function(index){
            if($scope.request){
                PaginationService.switchPage(index, constant.searchQuery + '/search?' + buildQuery($scope.request)+ '&').then(function(data){
                    $scope.resources = data.data;
                    $scope.currentPage = PaginationService.currentPage;
                });
            }else {
                PaginationService.switchPage(index, constant.searchQuery + '?').then(function(data){
                    $scope.resources = data.data;
                    $scope.currentPage = PaginationService.currentPage;
                });
            }

        };

        $scope.switchPage($scope.currentPage);

        $scope.setPage = function(pageLink, pageType){
            PaginationService.setPage(pageLink, pageType, $scope.resources._meta.pageCount).then(function(data){
                $scope.resources = data.data;
                $scope.currentPage = PaginationService.currentPage;
            });
        };

        SearchService.getClasses().then(function(data){
            $scope.classes = data.data;
            $scope.classes.unshift({class_id: undefined, name:'Оберіть клас'});
        });

        $scope.search = function(){
            console.log('query:');
            console.log(buildQuery($scope.request));
            if(length($scope.request))
                SearchService.search(buildQuery($scope.request))
                    .then(function(data){
                        $scope.resources = data.data;
                    console.log($scope.resources);
                        console.log(PaginationService.currentPage);
                        $rootScope.currentPage = PaginationService.currentPage;
                    });
        };

        $scope.cancelSearch = function(){
            $http.get('/rest.php/searches?&per-page=' + constant.perPage).then(function(data){
                $scope.resources = data.data;
                $scope.request = {};
            });
        };

        function buildQuery(query){
			var str = '';
			for(var main_key in query)
			{
				str += main_key + '=model';
				for(var key in query[main_key])
				{
					if(query[main_key][key]){
						if ( query[main_key][key].start || query[main_key][key].end)
							str += beetwen(key, query[main_key][key]);
						else
							str += '&' + key + '=' + query[main_key][key];
					}
				}
				str += '&';
			}
			str = str.substr(0, str.length-1);
			return str;
		};
		function beetwen(key, p){
			var s = '';
			if(p.start && !p.end)
				s += '&' + key + '=' + p.start + 'to';
			if(!p.start && p.end)
				s += '&' + key + '=' + 'to' + p.end;
			if(p.start && p.end)
				s += '&' + key + '=' + p.start + 'to' + p.end;
			return s;
		};
		function length(obj){
			return Object.keys(obj).length;
		};
    }

})();