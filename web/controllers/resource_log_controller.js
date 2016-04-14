/**
 * Created by romangrb on 10/6/15.
 */
(function() {
    'use strict';
    angular
        .module('restApp')
        .controller('resourceLogCtrl', resourceLogCtrl);
    resourceLogCtrl.$inject = ['$scope', '$http', 'RestService', '$rootScope', '$location', '$route', 'PaginationService', 'constant'];

    function resourceLogCtrl($scope, $http, RestService,  $rootScope, $location, $route,  PaginationService, constant) {

        var dateToday = new Date(),
            date_end_default = dateToday,
            date_start_default = setDiffTime(dateToday,constant.TIME_DIFF),
            dateMaxTimer = new Date();

        $scope.operation = {

            interval:false,
            type:{
                created: true,
                updated: false,
                deleted: false
            },
            resource:{
                name:''
            },
            date:{
                dateStart:date_start_default,
                dateEnd:date_end_default
            }
        };

        $scope.minDate = null;
        $scope.maxDateEnd = new Date();
        $scope.maxDateStart = setDiffTime(dateMaxTimer, constant.TIME_DIFF);
        $scope.hourStep = 1;
        $scope.minuteStep = 10;
        $scope.showMeridian = false;

        $scope.dateOptions = {
            startingDay: 1,
            showWeeks: false
        };

        $scope.$watch("operation.date.dateStart", function(time) {

            if(time===null){
                time = date_start_default;
                $scope.operation.date.dateStart = time;
            }
            date_start_default = time;
            if ($scope.operation.date.dateStart>$scope.maxDateStart)  {
                $scope.operation.date.dateStart= setDiffTime(date_end_default, constant.TIME_DIFF);
                $scope.operation.date.dateEnd = new Date();
            }

            $scope.operation.date.start = toDateInISO(time);
        }, false);

        $scope.$watch("operation.date.dateEnd", function(time) {

            if(time===null){
                time = date_end_default;
                $scope.operation.date.dateEnd = time;
            }
            date_end_default = time;

            var dateLimitStart = setDiffTime(date_end_default, constant.TIME_DIFF);
            $scope.operation.date.dateStart = $scope.maxDateStart = dateLimitStart;
            $scope.operation.date.end = toDateInISO(time);

        }, false);

        $scope.findResourceLog = function() {

            $scope.queryData = buildQuery($scope.operation);

            if(!$scope.queryData) {
                alert(constant.MSG_TO_FILL_TYPE_OPERATION);
                return;
            }

            RestService.getData('operations/search?' + $scope.queryData)
                .then(function(data){
                    $scope.operation_log = data.data;
                });
        };

        function toDateInISO(date){
            //2015-11-06 12:08:46
            var dateInISO = (new Date ((new Date((new Date(date))
                    .toISOString())).getTime(date) - ((new Date())
                    .getTimezoneOffset()*constant.MSEC_IN_MIN)))
                    .toISOString().slice(0, 19).replace('T', ' ');
            return  dateInISO;
        };

        function buildQuery(res) {

            var requestData = toRequestFormatQuery(res),
                str = '';

            for (var key in requestData){
                str += key + '=' + requestData[key] + '&';
            }
            return str.slice(0, - 1);
        };

        function toRequestFormatQuery(query) {

            var str = '',
                requestData = {},
                OperTypeId=query['type'],
                OperResourceName=query['resource'],
                OperDateInterval=query['date'];

            for (var key in OperTypeId)
                if (OperTypeId[key]) {
                    str += operationToKey(key)+',';
                }

            if(!str) return;

            requestData.type=str.slice(0,-1);

            if(OperResourceName['name']) requestData.name = OperResourceName['name'];

            if($scope.operation.interval===true){
                requestData.date = OperDateInterval['start']+'to'+OperDateInterval['end'];
            }
            return requestData;
        };

        function operationToKey (name){
            var typeId;
            switch (name){
                case 'created':
                    return typeId = 1;
                    break;
                case 'updated':
                    return typeId = 2;
                    break;
                case 'deleted':
                    return typeId = 3;
                    break;
            }
        };

        function setDiffTime(date, dateDiff){
            if(!isTime(date))return;
            return new Date(new Date().setTime(date.getTime() - dateDiff));
        };

        function isTime(date){
            return (date instanceof Date && !isNaN(date.valueOf()));
        };

        //Pagination start
        $scope.currentPage = PaginationService.currentPage;

        $scope.getPages = function(pageCount) {
            return PaginationService.getPages(pageCount);
        };

        $scope.switchPage = function(index){
            if($scope.queryData){
                PaginationService.switchPage(index, constant.operationsQuery + '/search?' + $scope.queryData + '&')
                    .then(function(data){
                        $scope.operation_log = data.data;
                        $scope.currentPage = PaginationService.currentPage;
                    });
            }else {
                PaginationService.switchPage(index, constant.operationsQuery + '?')
                    .then(function(data){
                        $scope.operation_log = data.data;
                        $scope.currentPage = PaginationService.currentPage;
                    });
            }

        };

        $scope.setPage = function(pageLink, pageType){
            PaginationService.setPage(pageLink, pageType, $scope.operation_log._meta.pageCount)
                .then(function(data){
                    $scope.operation_log = data.data;
                    $scope.currentPage = PaginationService.currentPage;
                 });
        };
        //Pagination end
    }

})();
