
var Reader = require('./reader');
var DistrictInfo = require('./district_info');

module.exports = class District {

    constructor(name) {
        this.db = new Reader(name);        
    }

    findInfo(addr, language) {
        var data = this.db.find(addr, language);
        if (data.length > 0) {
            return new DistrictInfo(data);
        } else {
            return null;
        }
    }
}