module.exports = class ASNInfo {
    constructor(data) {
        this.asn = data[0];
        this.registry = data[1];
        this.country = data[2];
        this.name = data[3];
        this.org = data[4];
    }
}