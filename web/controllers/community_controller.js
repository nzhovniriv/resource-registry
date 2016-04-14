(function () {
   'use strict';

   angular
       .module('restApp')
       .controller('UsersCommunity', UsersCommunity);

   UsersCommunity.$inject = ['$scope', '$http'];

   function UsersCommunity($scope, $http) {
   
       var usersCtrl = this;
       usersCtrl.users = [];
       (function(){
           return $http.get('rest.php/communities')
               .then(successHandler)
               .catch(errorHandler);
           function successHandler(result) {
               console.log(result);
               usersCtrl.users = result.data;
           }
           function errorHandler(result){
               alert(result.data[0].message);
               console.log(result.data[0].message);
           }
       }());
   }
})();