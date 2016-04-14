(function () {
    'use strict';

    angular
        .module('restApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$scope', '$http', '$rootScope'];
    function LoginController($location, $scope, $http, $rootScope) {
        $rootScope.currentUser = angular.fromJson(sessionStorage.getItem('user'));

        $rootScope.logout = function (){

            $http.get('rest.php/users/logout')
                .then(function(response){
                    var user = angular.fromJson(sessionStorage.getItem('user'));
                    user.isLogined = false;
                    sessionStorage.setItem('user',angular.toJson(user));
                    $location.path('site/login');
                });
        };

        var vm = this;

        if($location.search().p){
            console.log($location.search().p);
            vm.resetForm = true;
            console.log(vm.resetForm);
        } else {
            vm.resetForm = false;
            console.log(vm.resetForm);
        }

        vm.user = {
            username: '',
            password: '',
            rememberMe: 1
        };

        vm.logIn = function(){

            vm.user.username = vm.username;
            vm.user.password = vm.password;

            vm.send = function () {
                return $http.post('rest.php/users/login', vm.user)
                    .then(successHandler)
                    .catch(errorHandler);
                function successHandler(result) {
                    console.log(result.data);
                    sessionStorage.setItem('user',angular.toJson(result.data));
                    $rootScope.isLogined = true;
                    $location.path('/resource/index');

                }
                function errorHandler(result){
                    alert(result.data[0].message);
                    console.log(result.data[0].message);
                }
            };
            vm.send();
        };

        vm.restorePassword = function(){
            console.log('restore');
            vm.json = {
                username: vm.username
            };
            return $http.post('rest.php/users/restorepass', vm.json)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                alert('Повідомлення успішно відправлено на вашу електронну скриньку!');
                $location.path('/site/login');
            }
            function errorHandler(result){
                alert(result.data.message);
                console.log(result.data.message);
            }

        };
        vm.sendNewPassword = function(){
            console.log('send_new_password');
            vm.json = {
                username: $location.search().u,
                token: $location.search().p,
                password: vm.password
            };
            console.log(vm.json);
            return $http.post('rest.php/users/changepass', vm.json)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                console.log(result);
                alert('Пароль успішно змінено');
                $location.path('/site/login');
            }
            function errorHandler(result){
                alert(result.data.message);
                console.log(result.data.message);
            }

        };
    }

})();