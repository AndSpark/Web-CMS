"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MulterConfigService = void 0;
var common_1 = require("@nestjs/common");
var multer_1 = require("multer");
var fs = require("fs");
var path = require("path");
var dayjs = require("dayjs");
/**
 * 上传的文件配置服务
 */
var MulterConfigService = /** @class */ (function () {
    function MulterConfigService() {
    }
    MulterConfigService.prototype.createMulterOptions = function () {
        return {
            fileFilter: function (req, file, cb) {
                // 需要调用回调函数 `cb`，
                // 并在第二个参数中传入一个布尔值，用于指示文件是否可接受
                // 如果要拒绝文件，上传则传入 `false`。如:
                // cb(null, false);
                // 如果接受上传文件，则传入 `true`。如:
                cb(null, true);
                // 出错后，可以在第一个参数中传入一个错误：
                // cb(new Error('I don\'t have a clue!'));
                // console.log(file.filename);
                // cb(null, false);
            },
            storage: multer_1.diskStorage({
                destination: function (req, file, cb) {
                    var sitesJson = fs.readFileSync(path.join(__dirname, '../../../Sites/sites.json'), 'utf-8');
                    var sites = JSON.parse(sitesJson);
                    var headers = req.headers;
                    var host = headers.host;
                    var site = sites.find(function (v) { return v.hosts.find(function (x) { return x === host; }); });
                    if (!site) {
                        throw new common_1.HttpException('没有找到对应的站点', common_1.HttpStatus.NOT_FOUND);
                    }
                    var today = dayjs().format('YYYYMMDD');
                    var ext = path.parse(file.originalname).ext;
                    var uploadPath;
                    if (ext.match(/jpg|jpeg|png/)) {
                        uploadPath = "./Sites/" + site.site + "/static/upload/image/" + today;
                    }
                    else {
                        uploadPath = "./Sites/" + site.site + "/static/upload/file/" + today;
                    }
                    var dir = path.join(__dirname, '../../../', uploadPath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    cb(null, uploadPath);
                },
                filename: function (req, file, cb) {
                    var ext = path.parse(file.originalname).ext;
                    cb(null, dayjs().format('YYYYMMDDHHmmss') + ((Math.random() * Math.pow(36, 6)) | 0).toString(36) + ext);
                }
            })
        };
    };
    MulterConfigService = __decorate([
        common_1.Injectable()
    ], MulterConfigService);
    return MulterConfigService;
}());
exports.MulterConfigService = MulterConfigService;
