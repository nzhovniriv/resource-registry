(function () {
   'use strict';

    angular
        .module('restApp')
        .controller('UsersCommunity', UsersCommunity);

    UsersCommunity.$inject = ['$scope', '$http', 'PaginationService', 'constant', '$location'];
    function UsersCommunity($scope, $http, PaginationService, constant, $location) {
        var usersCtrl = this;
        usersCtrl.communities = [];
        (function(){
            return $http.get('rest.php/communities/show')
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                //console.log(result);
                usersCtrl.communities = result.data;
            }
            function errorHandler(result){
                alert(result.data[0].message);
                console.log(result.data[0].message);
            }
        }());

        usersCtrl.searchCommunity = function(community_name) {
          $http.get('http://rr.com/rest.php/communities/show?value='+ usersCtrl.communitySearch)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                console.log("done")
                usersCtrl.communities = result.data;
            }
            function errorHandler(result){
                console.log("eror");
            }
        };
    }
})();