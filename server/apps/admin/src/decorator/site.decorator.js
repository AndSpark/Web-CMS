"use strict";
exports.__esModule = true;
exports.Site = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
var dayjs = require("dayjs");
var fse = require("fs-extra");
var addSite = function (request, sites, sitesPath) {
    var form = request.body;
    if (sites.find(function (v) { return v.name === form.site; })) {
        if (form.isRemote) {
            return;
        }
        throw new common_1.HttpException('网站已存在', 403);
    }
    var siteForm = {
        site: form.site,
        name: form.name,
        hosts: form.hosts.split(','),
        status: 1,
        create_time: dayjs().format('YYYY-MM-DD'),
        visit: 0
    };
    sites.push(siteForm);
    fs.writeFileSync(sitesPath, JSON.stringify(sites));
    var tplPath = path.join(__dirname, '../../../Sites/site-tpl');
    var sitePath = path.join(__dirname, "../../../Sites/" + siteForm.site);
    if (fs.existsSync(sitePath)) {
        throw new common_1.HttpException('网站已存在', 403);
    }
    fs.mkdirSync(sitePath);
    fse.copySync(tplPath, sitePath);
};
var deleteSite = function (request, sites, sitesPath) {
    var body = request.body;
    var findSite = sites.findIndex(function (v) { return v.site === body.site; });
    if (findSite === -1) {
        throw new common_1.HttpException('网站不存在', 403);
    }
    sites.splice(findSite, 1);
    fs.writeFileSync(sitesPath, JSON.stringify(sites));
    var sitePath = path.join(__dirname, "../../../Sites/" + body.site);
    if (!fs.existsSync(sitePath)) {
        throw new common_1.HttpException('网站不存在', 403);
    }
    fse.removeSync(sitePath);
};
var updateSite = function (request, sites, sitesPath) {
    var form = request.body;
    var site = sites.find(function (v) { return v.site === form.site; });
    site.name = form.name;
    site.hosts = form.hosts.split(',');
    fs.writeFileSync(sitesPath, JSON.stringify(sites));
};
var updateStatus = function (request, sites, sitesPath) {
    var form = request.body;
    var site = sites.find(function (v) { return v.site === form.site; });
    site.status = (site.status ? 0 : 1);
    fs.writeFileSync(sitesPath, JSON.stringify(sites));
};
exports.Site = common_1.createParamDecorator(function (data, req) {
    var _a;
    var sitesPath = path.join(__dirname, '../../../Sites/sites.json');
    var sitesJson = fs.readFileSync(sitesPath, 'utf-8');
    var sites = JSON.parse(sitesJson);
    var request = req.args[0];
    var headers = request.headers;
    var url = request.url;
    var origin = headers.origin.replace(/https*:\/\//, '');
    var rep = request._parsedUrl.pathname.replace('/api/', '') + 'Rep';
    var site = sites.find(function (v) { return v.hosts.find(function (x) { return x === origin; }); });
    // console.log(headers,request.url,request.body,site);
    if (!site) {
        throw new common_1.HttpException('没有找到对应的网址', common_1.HttpStatus.NOT_FOUND);
    }
    var lg = (_a = headers.cookie) === null || _a === void 0 ? void 0 : _a.match(/lg=([\w]+);?/)[1];
    lg = lg ? lg : 'null';
    var sitetplpath = "/Sites/" + site.site + "/template/" + lg;
    var statsPath = "/Sites/" + site.site + "/data/stats.json";
    if (request.url.includes('/site/add')) {
        addSite(request, sites, sitesPath);
    }
    else if (request.url.includes('/site/delete')) {
        deleteSite(request, sites, sitesPath);
    }
    else if (request.url.includes('/site/update')) {
        updateSite(request, sites, sitesPath);
    }
    else if (request.url.includes('/site/status')) {
        updateStatus(request, sites, sitesPath);
    }
    else if (request.method.toUpperCase() !== 'GET') {
        var p1 = path.join(__dirname, "../../../cache/" + site.site);
        if (fs.existsSync(p1)) {
            fse.removeSync(p1);
        }
    }
    return { sitetplpath: sitetplpath, url: url, rep: rep, statsPath: statsPath };
});
