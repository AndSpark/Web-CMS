module.exports = class DistrictInfo {

    constructor(data) {
        this.countryName = data[0];
        this.regionName = data[1];
        this.cityName = data[2];
        this.districtName = data[3];
        this.chinaAdminCode = data[4];
        this.coveringRadius = data[5];
        this.longitude = data[6];
        this.latitude = data[7];
    }
}