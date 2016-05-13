(function () {

    angular.module('restApp')
        .factory('SharedService', SharedService);

    SharedService.$inject = ['$http','$location','constant'];
    function SharedService ($http, $location, constant) {
    	return {
		    sharedObject: {
		      mapClickData: ''
		    }
		  };

    }
})();
