L.Control.Coordinates = L.Control.extend({
        
        options: {
               position: 'bottomleft' 
        },
        
        onAdd: function (map) {
                this._div = L.DomUtil.create('div', 'map_coordinates');
                map.on('mousemove', this.updateCoordinates, this);
                this._div.innerHTML = '00°00\'00" : 00°00\'00"';
                return this._div;
        },

        updateCoordinates: function (e) {
            lat = this.formatNum(e.latlng.lat);
            lng = this.formatNum(e.latlng.lng);
            this._div.innerHTML = lat['deg'] + '°' + lat['min'] + '\'' 
                + lat['sec'] + '"' + ' : ' +  lng['deg'] + '°'
                + lng['min'] + '\'' + lng['sec'] + '"'; 
        },
        
        formatNum: function (num) {
            num = parseFloat(num);
            num = num.toFixed(4);
            var degrees = Math.floor(num);
            var minfloat = (num - degrees) * 60;
            var minutes = Math.floor(minfloat);
            var secfloat = (minfloat - minutes) * 60;
            var seconds = Math.round(secfloat);
            if (seconds == 60) {
                minutes++;
                seconds = 0;
            }
            if (minutes == 60) {
                degrees++;
                minutes = 0;
            }
            return {deg: degrees, min: minutes, sec: seconds };
        }

});

L.control.coordinates = function () {
        return new L.Control.Coordinates();
};