L.Control.Info = L.Control.extend({
        
        options: {
           position: 'topright'   
        },
        
        onAdd: function (map) {
                this._div = L.DomUtil.create('div', 'map_info'); // create a div with a class "info"
                this.update();
                return this._div;
        },

        update: function (house) {
                this._div.innerHTML = '<h4>House info</h4>' + (house ?
                        '<b>' + house.name + '</b><br>' + house.description : "Select house");
        }
});

L.control.info = function () {
        return new L.Control.Info();
};