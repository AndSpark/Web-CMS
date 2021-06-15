"use strict";
exports.__esModule = true;
exports.Site = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
var dayjs = require("dayjs");
var ipdb = require("../../../../libs/ipdb");
var ipdbPath = path.join(__dirname, '../../../libs/ipdb/ipipfree.ipdb');
var City = new ipdb.City(ipdbPath);
var statsSite = function (statsPath, req) {
    var _a;
    if (!fs.existsSync(statsPath)) {
        fs.writeFileSync(statsPath, '{"history":[],"total":0}');
    }
    var statsJSON = fs.readFileSync(statsPath, 'utf-8');
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var m = City.findMap(ip, "CN");
    var country = m.country_name;
    var city = m.city_name;
    if (country && country !== '中国' && country !== '本机地址') {
        city = country;
    }
    if (!city) {
        city = '其他';
    }
    var stats = JSON.parse(statsJSON);
    var today = dayjs().format('YYYY-MM-DD');
    var statsToday = stats.history.find(function (v) { return v.date === today; });
    if (statsToday) {
        if (statsToday.area[city]) {
            statsToday.area[city] = statsToday.area[city] + 1;
        }
        else {
            statsToday.area[city] = 1;
        }
    }
    else {
        statsToday = {
            date: today,
            area: (_a = {},
                _a[city] = 1,
                _a)
        };
        stats.history.push(statsToday);
    }
    stats.total++;
    fs.writeFileSync(statsPath, JSON.stringify(stats));
};
exports.Site = common_1.createParamDecorator(function (data, req) {
    var _a, _b;
    var sitesPath = path.join(__dirname, '../../../Sites/sites.json');
    var sitesJson = fs.readFileSync(sitesPath, 'utf-8');
    var sites = JSON.parse(sitesJson);
    var headers = req.args[0].headers;
    var url = req.args[0].url;
    var host = headers.host;
    var site = sites.find(function (v) { return v.hosts.find(function (x) { return x === host; }) && v.status; });
    if (!site) {
        throw new common_1.HttpException('没有找到对应的网址', 404);
    }
    site.visit++;
    fs.writeFileSync(sitesPath, JSON.stringify(sites));
    var lg;
    if (headers.cookie && ((_a = headers.cookie) === null || _a === void 0 ? void 0 : _a.match(/lg=([\w]+);?/))) {
        lg = (_b = headers.cookie) === null || _b === void 0 ? void 0 : _b.match(/lg=([\w]+);?/)[1];
    }
    lg = lg ? lg : 'null';
    var sitetplpath = "/Sites/" + site.site + "/template/" + lg;
    var statsPath = path.join(__dirname, "../../../Sites/" + site.site + "/data/stats.json");
    statsSite(statsPath, req.args[0]);
    return { sitetplpath: sitetplpath, url: url, host: host, statsPath: statsPath };
});
