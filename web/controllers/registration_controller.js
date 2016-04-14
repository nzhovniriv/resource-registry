(function () {
    'use strict';

    angular
        .module('restApp')
        .controller('RegistrationCtrl', RegisterController);

    RegisterController.$inject = ['$location', '$rootScope', '$scope', '$http'];
    function RegisterController($location, $rootScope, $scope, $http) {
        var vm = this;


        vm.user = {
            username: '',
            password: '',
            email: '',
            last_name: '',
            first_name: '',
            middle_name: '',
            passport_series: '',
            passport_number: '',
            address: ''
        };

        vm.registration = function(){
            console.log('test');

            vm.user.username = vm.username;
            vm.user.password = vm.password;
            vm.user.email = vm.email;
            vm.user.last_name = vm.last_name;
            vm.user.first_name =  vm.first_name;
            vm.user.middle_name = vm.middle_name;
            vm.user.passport_series =  vm.passport_series;
            vm.user.passport_number = vm.passport_number;
            vm.user.address = vm.address;

            vm.send = function () {
                return $http.post('rest.php/users/adduser', vm.user)
                    .then(successHandler)
                    .catch(errorHandler);
                function successHandler(result) {
                    console.log(result);
                   // localStorage.setItem('username',vm.username);
                    alert('Реєстрація пройшла успішно!');
                   $location.path('/site/login');

                }
                function errorHandler(result){
                    alert(result.data.message);
                    console.log(result);
                }
            };
            vm.send();
        };



    }

})();

