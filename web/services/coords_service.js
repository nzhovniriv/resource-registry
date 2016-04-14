(function () {

    angular.module('restApp')
        .factory('CoordsService', CoordsService);

    CoordsService.$inject = ['$http','$location','constant'];
    function CoordsService ($http, $location, constant) {

        var obj = {};

        obj.coordId = null;
        obj.coord = {};


        obj.convertDDToDMS =  function (deg) {

            deg = parseFloat(deg);
            deg = deg.toFixed(8);
            var d = Math.floor (deg);
            var minfloat = (deg-d)*60;
            var m = Math.floor(minfloat);
            var secfloat = (minfloat-m)*60;
            var s = secfloat.toFixed(2);
            if (s==60) {
                m++;
                s=0;
            }
            if (m==60) {
                d++;
                m=0;
            }
            return {deg: d, min: m, sec: s };
        };

        obj.convertDMSToDD = function (degrees, minutes, seconds) {
            return  parseFloat(degrees) + ( parseFloat(minutes)/60) + (parseFloat(seconds)/(60*60));
        };

        obj.formatCoords = function(coords){
            var res = obj.convertDDToDMS(coords);
            return res.deg +"°" + res.min +"\'"+ res.sec + "\"";
        };

        obj.geotypeToCoords = function(coords){
            var newCoords = [];
            //console.log(coords);
            coords = JSON.parse(coords);
            var i;
            for (i in coords) {
                newCoords.push({lat: coords[i][0], lng: coords[i][1]});
            }
            return newCoords;
        };

        obj.coordsToGeotype = function(coords){
            var newCoords = '[';
            var i;
            for (i in coords) {
                newCoords += '[';
                newCoords += coords[i].lat;
                newCoords += ',';
                newCoords += coords[i].lng;
                newCoords += ']';
                newCoords += ',';
            }
            newCoords = newCoords.substring(0, newCoords.length - 1);
            newCoords += ']';

            return newCoords;
        };

        obj.createCoords = function(coord, newCoords, coordId){

            if(coord.lat && coord.lng){
                if(coordId || coordId === 0){
                    newCoords[coordId] = {lat: coord.lat, lng: coord.lng};
                    coordId = null;
                }else{
                    newCoords.push({lat: coord.lat, lng: coord.lng});
                }
            }

            return coordId;
        };

        obj.changeCoords = function(coord, coordId){
            return {coord:{lat: parseFloat(coord.lat), lng: parseFloat(coord.lng)},coordId: coordId };
        };

        obj.deleteCoords = function(newCoords, coordId){
            newCoords.splice(coordId ,1);
        };

        return obj;
    }
})();
