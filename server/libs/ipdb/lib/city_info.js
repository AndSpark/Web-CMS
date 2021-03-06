var util = require('util');
const ASNInfo = require('./asn_info');
var districtInfo = require('./district_info');
module.exports = class CityInfo {
    
    constructor(data) {
        if (util.types.isMap(data)) {
            this.__assginMap(data);
        } else {
            this._assginArray(data);
        }
    }

    DistrictInfo() {
        if (!!this.district_info) {
            var qx = JSON.parse(this.district_info);
            return new districtInfo([
                this.countryName,
                this.regionName,
                this.cityName,
                qx["district_name"],
                qx["china_admin_code"],
                qx["covering_radius"],
                qx["longitude"],
                qx["latitude"]
            ]);
        } else {
            return null;
        }
    }

    ASNInfos() {
        if (!!this.asn_info) {
            var asn_list = JSON.parse(this.asn_info);
            var infos = [];
            asn_list.forEach(function(value){
                infos.push(new ASNInfo([
                    value.asn,
                    value.reg,
                    value.cc,
                    value.net,
                    value.org
                ]));
            });

            return infos;
        } else {
            return [];
        }
    }

    __assginMap(data) {
        this.countryName = this.getMap(data, "country_name", "");
        this.regionName = this.getMap(data, "region_name", "");
        this.cityName = this.getMap(data, "city_name", "");
        this.ownerDomain = this.getMap(data, "owner_domain", "");
        this.ispDomain = this.getMap(data, "isp_domain", "");
        this.latitude = this.getMap(data, "latitude", "");
        this.longitude = this.getMap(data, "longitude", "");
        this.timezone = this.getMap(data, "timezone", "");
        this.utcOffset = this.getMap(data, "utc_offset", "");
        this.chinaAdminCode = this.getMap(data, "china_admin_code", "");
        this.iddCode = this.getMap(data, "idd_code", "");
        this.countryCode = this.getMap(data, "country_code", "");
        this.continentCode = this.getMap(data, "continent_code", "");
        this.idc = this.getMap(data, "idc", "");
        this.baseStation = this.getMap(data, "base_station", "");
        this.countryCode3 = this.getMap(data, "country_code3", "");
        this.europeanUnion = this.getMap(data, "european_union", "");
        this.currencyCode = this.getMap(data, "currency_code", "");
        this.currencyName = this.getMap(data, "currency_name", "");
        this.anycast = this.getMap(data, "anycast", "");
        this.route = this.getMap(data, "route", "");
        this.asn = this.getMap(data, "asn", "");
        this.usage_type = this.getMap(data, "usage_type", "");
        this.district_info = this.getMap(data, "district_info", null);
        this.asn_info = this.getMap(data, "asn_info", null);
    }

    _assginArray(data) {
        var size = data.length;
        this.countryName = this.getItem(data, size, 1);
        this.regionName = this.getItem(data, size, 2);
        this.cityName = this.getItem(data, size, 3);
        this.ownerDomain = this.getItem(data, size, 4);
        this.ispDomain = this.getItem(data, size, 5);
        this.latitude = this.getItem(data, size, 6);
        this.longitude = this.getItem(data, size, 7);
        this.timezone = this.getItem(data, size, 8);
        this.utcOffset = this.getItem(data, size, 9);
        this.chinaAdminCode = this.getItem(data, size, 10);
        this.iddCode = this.getItem(data, size, 11);
        this.countryCode = this.getItem(data, size, 12);
        this.continentCode = this.getItem(data, size, 13);
        this.idc = this.getItem(data, size, 14);
        this.baseStation = this.getItem(data, size, 15);
        this.countryCode3 = this.getItem(data, size, 16);
        this.europeanUnion = this.getItem(data, size, 17);
        this.currencyCode = this.getItem(data, size, 18);
        this.currencyName = this.getItem(data, size, 19);
        this.anycast = this.getItem(data, size, 20);
    }

    getMap(map, key, value) {
        if (!!map[key]) {
            return map[key];
        } else {
            return value;
        }
    }
    getItem(items, size, index) {
        return size >= index ? items[index - 1] : '';
    }
}