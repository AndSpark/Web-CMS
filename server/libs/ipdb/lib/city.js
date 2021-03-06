
var Reader = require('./reader');

var CityInfo = require('./city_info');

module.exports = class City {

    constructor(name) {
        this.db = new Reader(name);        
    }

    find(addr, language) {
        return this.db.find(addr, language);
    }

    findMap(addr, language) {
        var data = this.db.find(addr, language);
        var fields = this.db.fields()
        var m = new Map();
        data.forEach(function(value, key){
            var field = fields[key];
            m[field] = value;
        })

        return m;
    }

    findInfo(addr, language) {
        var data = this.findMap(addr, language);
        return new CityInfo(data);
    }
}