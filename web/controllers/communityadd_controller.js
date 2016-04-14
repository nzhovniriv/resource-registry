(function () {
   'use strict';

   angular
       .module('restApp')
       .controller('communityAddCtrl', communityAddCtrl);

   communityAddCtrl.$inject = ['$scope', '$http', '$routeParams'];
   function communityAddCtrl($scope, $http, $routeParams) {
       var  comAdd = this;

          
       comAdd.getUserFromDb = function() {
          var data = {
            username: comAdd.username
          };
          var post = $http.post('rest.php/users/getuser', JSON.stringify(data))
               .then(successHandler)
               .catch(errorHandler);
           function successHandler(result) {
            console.log(result.data.username);
            console.log(result);
               comAdd.findUser = result.data.username;
           }
           function errorHandler(result){
               console.log("Error"+result);
           }
       }
   }
})();