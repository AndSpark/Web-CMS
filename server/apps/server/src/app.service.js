"use strict";
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
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var html_minifier_1 = require("html-minifier");
var parser_1 = require("./render/parser");
var path_1 = require("path");
var fs = require("fs");
var dbs_1 = require("../../../libs/db/dbs");
var AppService = /** @class */ (function () {
    function AppService() {
        this.dbList = [];
    }
    AppService.prototype.getHtml = function (sitetplpath, url, host) {
        return __awaiter(this, void 0, void 0, function () {
            var site, lg, cacheSitePath, cachePath, html_1, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        site = sitetplpath.match(/Sites\/([\w]+)/)[1];
                        lg = sitetplpath.match(/template\/([\w]+)/)[1];
                        cacheSitePath = path_1.join(__dirname, '../../../', 'cache', site);
                        cachePath = path_1.join(cacheSitePath, lg + url.replace(/\//g, '_'));
                        if (fs.existsSync(cachePath)) {
                            html_1 = fs.readFileSync(cachePath, 'utf-8');
                            return [2 /*return*/, html_1];
                        }
                        return [4 /*yield*/, this.createCache(cacheSitePath, cachePath, sitetplpath, url, host)];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppService.prototype.createCache = function (sitePath, cachePath, sitetplpath, url, host) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.render(sitetplpath, url, host)];
                    case 1:
                        html = _a.sent();
                        if (!fs.existsSync(sitePath))
                            fs.mkdirSync(sitePath);
                        try {
                            html = html_minifier_1.minify(html, { removeComments: true, collapseWhitespace: true, minifyJS: true, minifyCSS: true });
                        }
                        catch (error) {
                            return [2 /*return*/, error];
                        }
                        fs.writeFileSync(cachePath, html);
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppService.prototype.render = function (sitetplpath, url, host) {
        return __awaiter(this, void 0, Promise, function () {
            var db, parser, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        parser = new parser_1.Parser();
                        return [4 /*yield*/, parser.parse(sitetplpath, url, db, host)];
                    case 2:
                        html = _a.sent();
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppService.prototype.addMessage = function (sitetplpath, data) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.addMessage(data)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService = __decorate([
        common_1.Injectable()
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
