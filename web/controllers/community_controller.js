(function () {
   'use strict';

    angular
        .module('restApp')
        .controller('UsersCommunity', UsersCommunity);

    UsersCommunity.$inject = ['$scope', '$http', 'PaginationService', 'constant', '$location'];
    function UsersCommunity($scope, $http, PaginationService, constant, $location) {
        var comunityCtrl = this;
        comunityCtrl.communities = [];
        (function(){
            return $http.get('rest.php/communities/show')
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                comunityCtrl.communities = result.data;
            }
            function errorHandler(result){
                console.log("Can't render list!");
            }
        }());

        comunityCtrl.searchCommunity = function(community_name) {
            $http.get('http://rr.com/rest.php/communities/show?value='+ comunityCtrl.communitySearch)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                comunityCtrl.communities = result.data;
            }
            function errorHandler(result){
                console.log("Can't reload list!");
            }
        };
    }
})();