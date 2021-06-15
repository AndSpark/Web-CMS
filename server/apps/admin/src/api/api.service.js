"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ApiService = void 0;
var common_1 = require("@nestjs/common");
var dbs_1 = require("libs/db/dbs");
var path = require("path");
var fs = require("fs");
var FtpDeploy = require("ftp-deploy");
var WebSocket = require("ws");
var ApiService = /** @class */ (function () {
    function ApiService() {
    }
    ApiService.prototype.getDatas = function (rep, sitetplpath, query) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        if (!query) return [3 /*break*/, 3];
                        return [4 /*yield*/, db.getRepAllData(rep, query)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, db.getRepAllData(rep)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // todo：添加标签时判断是否已存在
    ApiService.prototype.addDatas = function (rep, data, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var db, entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.addRepData(rep, data)];
                    case 2:
                        entity = _a.sent();
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    ApiService.prototype.updateData = function (rep, data, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var db, entity;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        if (!Array.isArray(data)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(data.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db.updataRepData(rep, v.findOption, v.data)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, db.updataRepData(rep, data.findOption, data.data)];
                    case 4:
                        entity = _a.sent();
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    ApiService.prototype.deleteData = function (rep, data, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        if (!Array.isArray(data)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(data.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db.deleteRepData(rep, v)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, db.deleteRepData(rep, data)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.getContent = function (findOption, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.getContentData(findOption)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.putContent = function (data, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.putContentData(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.getStats = function (statsPath) {
        return __awaiter(this, void 0, void 0, function () {
            var JSON;
            return __generator(this, function (_a) {
                JSON = fs.readFileSync(statsPath, 'utf-8');
                return [2 /*return*/, JSON];
            });
        });
    };
    ApiService.prototype.uploadSite = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var ftpDeploy, config, wss;
            return __generator(this, function (_a) {
                ftpDeploy = new FtpDeploy();
                config = {
                    user: 'gol',
                    password: 'gubobo123',
                    host: '43.129.251.166',
                    port: 21,
                    localRoot: path.join(__dirname, '../../../Sites', site),
                    remoteRoot: '/node/leso/Sites',
                    include: ['*'],
                    exclude: ['config/**'],
                    deleteRemote: false,
                    forcePasv: true,
                    sftp: false
                };
                wss = new WebSocket.Server({ port: 8084 });
                wss.on('connection', function (ws) {
                    ftpDeploy
                        .deploy(config)
                        .then(function (res) {
                        ws.send('{"status":"success"}');
                        wss.close();
                    })["catch"](function (err) { return console.log(err); });
                    ftpDeploy.on('uploading', function (data) {
                        var res = __assign({ status: 'uploading' }, data);
                        var resJSON = JSON.stringify(res);
                        ws.send(resJSON);
                    });
                    ftpDeploy.on('uploaded', function (data) {
                        var res = __assign({ status: 'uploaded' }, data);
                        var resJSON = JSON.stringify(res);
                        ws.send(resJSON);
                    });
                    ftpDeploy.on('upload-error', function (data) {
                        var res = __assign({ status: 'error' }, data);
                        var resJSON = JSON.stringify(res);
                        ws.send(resJSON);
                    });
                });
                return [2 /*return*/, 'ok'];
            });
        });
    };
    ApiService = __decorate([
        common_1.Injectable()
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
