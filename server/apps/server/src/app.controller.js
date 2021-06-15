"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var site_decorator_1 = require("./decorator/site.decorator");
var pages_guard_1 = require("./guard/pages.guard");
var AppController = /** @class */ (function () {
    function AppController(appService) {
        this.appService = appService;
    }
    AppController.prototype.index = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var sitetplpath, url, host, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitetplpath = site.sitetplpath, url = site.url, host = site.host;
                        return [4 /*yield*/, this.appService.getHtml(sitetplpath, url, host)];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppController.prototype.search = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var sitetplpath, url, host, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitetplpath = site.sitetplpath, url = site.url, host = site.host;
                        return [4 /*yield*/, this.appService.getHtml(sitetplpath, url, host)];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppController.prototype.about = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var sitetplpath, url, host, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitetplpath = site.sitetplpath, url = site.url, host = site.host;
                        return [4 /*yield*/, this.appService.getHtml(sitetplpath, url, host)];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, html];
                }
            });
        });
    };
    AppController.prototype.area = function (lg, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.cookie('lg', lg, { maxAge: 100000000000 });
                res.redirect('/');
                return [2 /*return*/];
            });
        });
    };
    AppController.prototype.addMsg = function (site, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.addMessage(site.sitetplpath, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "\n\t\t<script>\n\t\talert('\u63D0\u4EA4\u6210\u529F\uFF01')\n\t\tsetTimeout(() => {\n\t\t\thistory.go(-1)\n\t\t}, 1000);\n\t\t</script>\n\t\t"];
                }
            });
        });
    };
    __decorate([
        common_1.Get(),
        __param(0, site_decorator_1.Site())
    ], AppController.prototype, "index");
    __decorate([
        common_1.Get([
            '/Search/index.html',
            '/Search/index.html/page/:page'
        ]),
        __param(0, site_decorator_1.Site())
    ], AppController.prototype, "search");
    __decorate([
        common_1.Get([
            '/content/:id',
            '/about/:scode',
            '/list/:scode',
            '/list/:scode/page/:page',
        ]),
        common_1.UseGuards(pages_guard_1.PagesGuard),
        __param(0, site_decorator_1.Site())
    ], AppController.prototype, "about");
    __decorate([
        common_1.Get('/Do/area.html'),
        __param(0, common_1.Query('lg')), __param(1, common_1.Res())
    ], AppController.prototype, "area");
    __decorate([
        common_1.Post('/Message/add.html'),
        __param(0, site_decorator_1.Site()), __param(1, common_1.Body())
    ], AppController.prototype, "addMsg");
    AppController = __decorate([
        common_1.Controller()
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
