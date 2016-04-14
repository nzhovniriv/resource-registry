(function () {
    'use strict';

    angular
        .module('restApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$filter', '$q'];
    function UserService($filter, $q) {


        function GetAll() {

        }

        function GetById(id) {

        }

        function GetByUsername(login) {

        }

        function Create(user) {

        }

        function Update(user) {

        }

        function Delete(id) {

        }

        // private functions

        function getUsers() {

        }

        function setUsers(users) {

        }
    }
})();