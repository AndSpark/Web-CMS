"use strict";
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
exports.Parser = void 0;
var path_1 = require("path");
var fs = require("fs");
var tool_1 = require("../../../../libs/common/tool");
var common_1 = require("@nestjs/common");
var dayjs = require("dayjs");
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.prototype.init = function (sitetplpath, url, db, host) {
        return __awaiter(this, void 0, void 0, function () {
            var acode, area, htmlPath, htmlPath, regUrl, urlMatch, _a, _b, _c, template, htmlPath, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.sitetplpath = sitetplpath;
                        this.url = url;
                        this.db = db;
                        this.host = host;
                        this.currentPage = 1;
                        acode = this.sitetplpath.match(/template\/([\w]+)/)[1];
                        if (!(acode === 'null')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.getDefaultArea()];
                    case 1:
                        area = _d.sent();
                        this.acode = area.acode;
                        this.sitetplpath = this.sitetplpath.replace('null', area.acode);
                        return [3 /*break*/, 3];
                    case 2:
                        this.acode = this.sitetplpath.match(/template\/([\w]+)/)[1];
                        _d.label = 3;
                    case 3:
                        this.tplPath = path_1.join(__dirname, '../../../', this.sitetplpath);
                        // 对index页面
                        if (this.url == '/') {
                            this.type = 'index';
                            htmlPath = path_1.join(this.tplPath, 'index.html');
                            this.html = fs.readFileSync(htmlPath, 'utf-8');
                            return [2 /*return*/];
                        }
                        if (this.url.includes('/Search/index.html')) {
                            this.type = 'search';
                            this.search = this.url.match(/\?[\S]+/)[0];
                            this.searchKeyword = this.url.match(/keyword=([^&]+)?&?/)[1];
                            this.searchScode = this.url.match(/scode=([0-9]+)?&?/)[1];
                            if (this.url.match(/page\/([0-9]+)\.html/))
                                this.currentPage = Number(this.url.match(/page\/([0-9]+)\.html/)[1]);
                            htmlPath = path_1.join(this.tplPath, 'search.html');
                            this.html = fs.readFileSync(htmlPath, 'utf-8');
                            return [2 /*return*/];
                        }
                        regUrl = /\/(content|about|list)\/([0-9]+)(\.html|\/page\/([0-9]+)\.html)/;
                        urlMatch = this.url.match(regUrl);
                        this.type = urlMatch[1];
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 13, , 14]);
                        _a = this.type;
                        switch (_a) {
                            case 'about': return [3 /*break*/, 5];
                            case 'list': return [3 /*break*/, 7];
                            case 'content': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 5:
                        this.pageScode = urlMatch[2];
                        _b = this;
                        return [4 /*yield*/, this.db.getAbout(this.pageScode)];
                    case 6:
                        _b.pageId = (_d.sent()).id;
                        return [3 /*break*/, 11];
                    case 7:
                        this.pageScode = urlMatch[2];
                        this.currentPage = urlMatch[4] ? parseInt(urlMatch[4]) : 1;
                        return [3 /*break*/, 11];
                    case 8:
                        this.pageId = parseInt(urlMatch[2]);
                        _c = this;
                        return [4 /*yield*/, this.db.getContent(this.pageId)];
                    case 9:
                        _c.pageScode = (_d.sent()).scode;
                        return [3 /*break*/, 11];
                    case 10: return [3 /*break*/, 11];
                    case 11: return [4 /*yield*/, this.db.getTemplate(this.pageScode, this.pageId)];
                    case 12:
                        template = _d.sent();
                        htmlPath = path_1.join(this.tplPath, template);
                        this.html = fs.readFileSync(htmlPath, 'utf-8');
                        return [3 /*break*/, 14];
                    case 13:
                        error_1 = _d.sent();
                        throw new common_1.HttpException('网址输入有误', 404);
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parse = function (sitetplpath, url, db, host) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init(sitetplpath, url, db, host)];
                    case 1:
                        _a.sent();
                        this.parseInclude();
                        return [4 /*yield*/, this.parseSite()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.parseCompany()];
                    case 3:
                        _a.sent();
                        this.parseOther();
                        return [4 /*yield*/, this.parseLabel()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.parseSort()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.parseContent()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.parsePosition()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.parseNav()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.parseList()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.parseSearch()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.parseContentId()];
                    case 11:
                        _a.sent();
                        this.parsePage();
                        return [4 /*yield*/, this.parsePics()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.parseSlide()];
                    case 13:
                        _a.sent();
                        this.parseQrcode();
                        this.parseLoop();
                        this.parseIf();
                        return [2 /*return*/, this.newHtml];
                }
            });
        });
    };
    Parser.prototype.parseInclude = function () {
        var _this = this;
        var reg = /{include file=(inc\/[a-z]*\.html)}/g;
        this.newHtml = this.html.replace(reg, function (match, file) {
            var incPath = path_1.join(_this.tplPath, file);
            var incFile = fs.readFileSync(incPath, 'utf-8');
            return incFile;
        });
    };
    Parser.prototype.parseSite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, _a, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg = /\{lesocms:site([\w]+)(\s+[^}]+)?\}/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params) { return __awaiter(_this, void 0, void 0, function () {
                                var site, res, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.db.getSite(this.acode)];
                                        case 1:
                                            site = _b.sent();
                                            res = site[params];
                                            if (res) {
                                                return [2 /*return*/, res];
                                            }
                                            _a = params;
                                            switch (_a) {
                                                case 'index': return [3 /*break*/, 2];
                                                case 'path': return [3 /*break*/, 3];
                                                case 'language': return [3 /*break*/, 4];
                                                case 'tplpath': return [3 /*break*/, 6];
                                            }
                                            return [3 /*break*/, 7];
                                        case 2:
                                            res = '/';
                                            return [3 /*break*/, 8];
                                        case 3:
                                            res = this.sitetplpath.replace(/\/template\/.+/, '');
                                            return [3 /*break*/, 8];
                                        case 4: return [4 /*yield*/, this.db.getAreaLanguage(this.acode)];
                                        case 5:
                                            res = _b.sent();
                                            return [3 /*break*/, 8];
                                        case 6:
                                            res = this.sitetplpath;
                                            return [3 /*break*/, 8];
                                        case 7: return [2 /*return*/, res];
                                        case 8: return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        throw new common_1.HttpException('parseSite Error:  ' + error_2.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseCompany = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, _a, error_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg = /\{lesocms:company([\w]+)(\s+[^}]+)?\}/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params) { return __awaiter(_this, void 0, void 0, function () {
                                var company;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.getCompany(this.acode)];
                                        case 1:
                                            company = _a.sent();
                                            return [2 /*return*/, company[params]];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        throw new common_1.HttpException('parseCompany Error:  ' + error_3.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, _a, error_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg = /{label:([\w]+)(\s+[^}]+)?}/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, name) { return __awaiter(_this, void 0, void 0, function () {
                                var labelEntity;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.db.getLabel(name)];
                                        case 1:
                                            labelEntity = _a.sent();
                                            if (labelEntity) {
                                                return [2 /*return*/, labelEntity.value];
                                            }
                                            return [2 /*return*/, match];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        throw new common_1.HttpException('parseLabel Error:  ' + error_4.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseSort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, sortEntity_1, pSort_1, topSort_1, _a, error_5;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (this.type.match(/index|search/)) {
                            return [2 /*return*/, (this.newHtml = this.newHtml.replace(/\{sort:(scode|tcode|scode)\}/g, '0'))];
                        }
                        if (!this.pageScode)
                            return [2 /*return*/];
                        reg = /\{sort:([\w]+)(\s+[^}]+)?\}/g;
                        return [4 /*yield*/, this.db.getSort(this.pageScode)];
                    case 1:
                        sortEntity_1 = _b.sent();
                        return [4 /*yield*/, this.db.getParentSort(this.pageScode)];
                    case 2:
                        pSort_1 = _b.sent();
                        return [4 /*yield*/, this.db.getTopSort(this.pageScode)];
                    case 3:
                        topSort_1 = _b.sent();
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params, params2) { return __awaiter(_this, void 0, void 0, function () {
                                var res, paramsFunc;
                                return __generator(this, function (_a) {
                                    paramsFunc = {
                                        tcode: function () {
                                            res = topSort_1 === null || topSort_1 === void 0 ? void 0 : topSort_1.scode;
                                        },
                                        topname: function () {
                                            res = topSort_1 === null || topSort_1 === void 0 ? void 0 : topSort_1.name;
                                        },
                                        toplink: function () {
                                            res = topSort_1 ? "/" + this.type + "/" + topSort_1.scode + ".html" : '/';
                                        },
                                        parentname: function () {
                                            res = pSort_1 === null || pSort_1 === void 0 ? void 0 : pSort_1.name;
                                        },
                                        parentlink: function () {
                                            res = pSort_1 ? "/" + this.type + "/" + pSort_1.scode + ".html" : '/';
                                        },
                                        link: function () {
                                            res = sortEntity_1.outlink
                                                ? sortEntity_1.outlink
                                                : "/" + this.type + "/" + sortEntity_1.scode + ".html";
                                        },
                                        type: function () {
                                            res = sortEntity_1.mcode === '1' ? '1' : '2';
                                        }
                                    };
                                    res = sortEntity_1[params];
                                    if (res !== undefined) {
                                        return [2 /*return*/, res];
                                    }
                                    paramsFunc[params]();
                                    return [2 /*return*/, res];
                                });
                            }); })];
                    case 4:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _b.sent();
                        throw new common_1.HttpException('parseSort Error:  ' + error_5.message, 500);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, conEntity_1, sort_1, subSort_1, _a, error_6;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!this.pageId)
                            return [2 /*return*/];
                        reg = /\{content:([\w]+)(\s+[^}]+)?\}/g;
                        return [4 /*yield*/, this.db.getContent(this.pageId)];
                    case 1:
                        conEntity_1 = _b.sent();
                        return [4 /*yield*/, this.db.getSort(conEntity_1.scode)];
                    case 2:
                        sort_1 = _b.sent();
                        if (!conEntity_1.subscode) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.db.getSort(conEntity_1.subscode)];
                    case 3:
                        subSort_1 = _b.sent();
                        _b.label = 4;
                    case 4:
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params, p2) { return __awaiter(_this, void 0, void 0, function () {
                                var res, reg_1, style, pre, next, parmasfunc;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            res = conEntity_1[params];
                                            p2 = p2 ? p2 : '';
                                            if (params === 'content') {
                                                res = tool_1.htmlDecode(res);
                                            }
                                            if (!params.includes('ext_')) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.db.getConExp(this.pageId, params)];
                                        case 1:
                                            res = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (p2.includes('style=')) {
                                                reg_1 = /style=([Y-m-d]+)/;
                                                style = p2.match(reg_1)[1];
                                                if (style === 'Y-m') {
                                                    res = dayjs(res).format('YYYY-MM');
                                                }
                                                else if (style === 'Y-m-d') {
                                                    res = dayjs(res).format('YYYY-MM-DD');
                                                }
                                            }
                                            if (res !== undefined)
                                                return [2 /*return*/, res];
                                            return [4 /*yield*/, this.db.getContentPre(this.pageId)];
                                        case 3:
                                            pre = _a.sent();
                                            return [4 /*yield*/, this.db.getContentNext(this.pageId)];
                                        case 4:
                                            next = _a.sent();
                                            parmasfunc = {
                                                sortname: function () {
                                                    res = sort_1.name;
                                                },
                                                subsortname: function () {
                                                    res = subSort_1.name;
                                                },
                                                sortlink: function () {
                                                    return "/list/" + sort_1.scode + ".html";
                                                },
                                                subsortlink: function () {
                                                    return "/list/" + subSort_1.scode + ".html";
                                                },
                                                precontent: function () {
                                                    res = pre
                                                        ? (res = "<a href=\"/content/" + pre.id + ".html\">" + pre.title + "</a>")
                                                        : p2.includes('notext=')
                                                            ? p2.match(/notext='[\w]+?'/)[1]
                                                            : '没有了';
                                                },
                                                prelink: function () {
                                                    res = pre ? "/content/" + pre.id + ".html\"" : 'javascript:;';
                                                },
                                                pretitle: function () {
                                                    res = pre
                                                        ? pre.title
                                                        : p2.includes('notext=')
                                                            ? p2.match(/notext='[\w]+?'/)[1]
                                                            : '没有了';
                                                },
                                                preico: function () {
                                                    res = pre ? pre.ico : '';
                                                },
                                                nextcontent: function () {
                                                    res = next
                                                        ? "<a href=\"/content/" + next.id + ".html\">" + next.title + "</a>"
                                                        : p2.includes('notext=')
                                                            ? p2.match(/notext='[\w]+?'/)[1]
                                                            : '没有了';
                                                },
                                                nextlink: function () {
                                                    res = next ? "/content/" + next.id + ".html\"" : 'javascript:;';
                                                },
                                                nexttitle: function () {
                                                    res = next
                                                        ? next.title
                                                        : p2.includes('notext=')
                                                            ? p2.match(/notext='[\w]+?'/)[1]
                                                            : '没有了';
                                                },
                                                nextico: function () {
                                                    res = next ? next.ico : '';
                                                },
                                                isico: function () {
                                                    var ico = conEntity_1.ico;
                                                    return ico ? 1 : 0;
                                                }
                                            };
                                            parmasfunc[params]();
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 5:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_6 = _b.sent();
                        throw new common_1.HttpException('parseContent Error:  ' + error_6.message, 500);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseNav = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg1, reg2_1, reg3_1, acode_1, deep_1, _a, error_7;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        reg1 = /\{lesocms:nav(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:nav\}/g;
                        reg2_1 = /\[nav:([\w]+)(\s+[^\]]+)?\]/g;
                        reg3_1 = /lesocms:([0-9])+nav/g;
                        acode_1 = this.acode;
                        deep_1 = false;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg1, function (match, params, content) { return __awaiter(_this, void 0, void 0, function () {
                                var parent, num, res, db, numMatch, parentMatch, subSorts, _loop_1, i, reg4;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            parent = '0', num = 9999, res = '', db = this.db;
                                            if (params) {
                                                numMatch = params.match(/\snum=([0-9]+)/);
                                                num = numMatch ? Number(numMatch[1]) : 9999;
                                                parentMatch = params.match(/\sparent=([0-9]+)/);
                                                parent = parentMatch ? parentMatch[1] : '0';
                                            }
                                            return [4 /*yield*/, this.db.getSubScodes(parent)];
                                        case 1:
                                            subSorts = (_a.sent()).filter(function (v, i) { return i < num && v.acode === acode_1; });
                                            if (!subSorts)
                                                return [2 /*return*/, res];
                                            _loop_1 = function (i) {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _a = res;
                                                            return [4 /*yield*/, tool_1.replaceAsync(content, reg2_1, function (match2, params2) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var r, params2Func;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                r = subSorts[i][params2];
                                                                                if (r !== undefined)
                                                                                    return [2 /*return*/, r];
                                                                                params2Func = {
                                                                                    n: function () {
                                                                                        return i;
                                                                                    },
                                                                                    i: function () {
                                                                                        return i + 1;
                                                                                    },
                                                                                    link: function () {
                                                                                        return subSorts[i].outlink
                                                                                            ? subSorts[i].outlink
                                                                                            : "/" + (this.type() === '1' ? 'about' : 'list') + "/" + subSorts[i].scode + ".html";
                                                                                    },
                                                                                    type: function () {
                                                                                        return subSorts[i].mcode === '1' ? '1' : '2';
                                                                                    },
                                                                                    soncount: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var sons;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getSubScodes(subSorts[i].scode)];
                                                                                                    case 1:
                                                                                                        sons = _a.sent();
                                                                                                        return [2 /*return*/, sons.length];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    rows: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var cons;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getContentList(subSorts[i].scode, 9999, 0, {})];
                                                                                                    case 1:
                                                                                                        cons = _a.sent();
                                                                                                        return [2 /*return*/, cons.length];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    }
                                                                                };
                                                                                return [4 /*yield*/, params2Func[params2]()];
                                                                            case 1:
                                                                                r = _a.sent();
                                                                                return [2 /*return*/, r];
                                                                        }
                                                                    });
                                                                }); })];
                                                        case 1:
                                                            res = _a + _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            i = 0;
                                            _a.label = 2;
                                        case 2:
                                            if (!(i < subSorts.length)) return [3 /*break*/, 5];
                                            return [5 /*yield**/, _loop_1(i)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            i++;
                                            return [3 /*break*/, 2];
                                        case 5:
                                            if (res.match(reg3_1)) {
                                                reg4 = /([0-9])+nav/g;
                                                deep_1 = true;
                                                res = res.replace(reg4, function (match, n) {
                                                    if (Number(n) > 1) {
                                                        var d = void 0;
                                                        if (Number(n) - 1 === 1) {
                                                            d = '';
                                                        }
                                                        else {
                                                            d = Number(n) - 1;
                                                        }
                                                        return d + "nav";
                                                    }
                                                    return match;
                                                });
                                            }
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        if (!deep_1) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.parseNav()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _b.sent();
                        throw new common_1.HttpException('parseNav Error:  ' + error_7.message, 500);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseSorts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg1, reg2_2, _a, error_8;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg1 = /\{lesocms:sort(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:sort\}/g;
                        reg2_2 = /\[sort:([\w]+)(\s+[^\]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg1, function (match, params, content) { return __awaiter(_this, void 0, void 0, function () {
                                var scode, res, db, scodeMatch, subSorts, _loop_2, i;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scode = '0', res = '', db = this.db;
                                            if (params) {
                                                scodeMatch = params.match(/\sscode=([0-9]+)/);
                                                scode = scodeMatch ? scodeMatch[1] : '0';
                                            }
                                            return [4 /*yield*/, this.db.getSubScodes(scode)];
                                        case 1:
                                            subSorts = _a.sent();
                                            if (!subSorts)
                                                return [2 /*return*/, res];
                                            _loop_2 = function (i) {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _a = res;
                                                            return [4 /*yield*/, tool_1.replaceAsync(content, reg2_2, function (match2, params2) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var r, params2Func;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                r = subSorts[i][params2];
                                                                                if (r !== undefined)
                                                                                    return [2 /*return*/, r];
                                                                                params2Func = {
                                                                                    n: function () {
                                                                                        return i;
                                                                                    },
                                                                                    i: function () {
                                                                                        return i + 1;
                                                                                    },
                                                                                    link: function () {
                                                                                        return subSorts[i].outlink
                                                                                            ? subSorts[i].outlink
                                                                                            : "/" + (this.type() === '1' ? 'about' : 'list') + "/" + subSorts[i].scode + ".html";
                                                                                    },
                                                                                    type: function () {
                                                                                        return subSorts[i].mcode === '1' ? '1' : '2';
                                                                                    },
                                                                                    parentname: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var parent;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getParentSort(subSorts[i].scode)];
                                                                                                    case 1:
                                                                                                        parent = _a.sent();
                                                                                                        return [2 /*return*/, parent.name];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    toprows: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var t, cons;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getTopSort(subSorts[i].scode)];
                                                                                                    case 1:
                                                                                                        t = _a.sent();
                                                                                                        return [4 /*yield*/, db.getContentList(t.scode, 9999, 0, {})];
                                                                                                    case 2:
                                                                                                        cons = _a.sent();
                                                                                                        return [2 /*return*/, cons.length];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    parentrows: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var p, cons;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getParentSort(subSorts[i].scode)];
                                                                                                    case 1:
                                                                                                        p = _a.sent();
                                                                                                        return [4 /*yield*/, db.getContentList(p.scode, 9999, 0, {})];
                                                                                                    case 2:
                                                                                                        cons = _a.sent();
                                                                                                        return [2 /*return*/, cons.length];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    rows: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var cons;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getContentList(subSorts[i].scode, 9999, 0, {})];
                                                                                                    case 1:
                                                                                                        cons = _a.sent();
                                                                                                        return [2 /*return*/, cons.length];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    }
                                                                                };
                                                                                return [4 /*yield*/, params2Func[params2]()];
                                                                            case 1:
                                                                                r = _a.sent();
                                                                                return [2 /*return*/, r];
                                                                        }
                                                                    });
                                                                }); })];
                                                        case 1:
                                                            res = _a + _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            i = 0;
                                            _a.label = 2;
                                        case 2:
                                            if (!(i < subSorts.length)) return [3 /*break*/, 5];
                                            return [5 /*yield**/, _loop_2(i)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            i++;
                                            return [3 /*break*/, 2];
                                        case 5: return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _b.sent();
                        throw new common_1.HttpException('parseSorts Error:  ' + error_8.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg1, reg2_3, _a, error_9;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg1 = /\{lesocms:list(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:list\}/g;
                        reg2_3 = /\[list:([\w]+)(\s+[^\]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg1, function (match, params, content) { return __awaiter(_this, void 0, void 0, function () {
                                var scode, num, order, tags, filter, start, res, db, scodeMatch, numMatch, startMatch, orderMatch, tagsMatch, filterMatch, sort, cons, counts, _loop_3, i;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scode = this.pageScode, num = 9999, order = {}, tags = '', filter = '', start = 0, res = '', db = this.db;
                                            if (params) {
                                                scodeMatch = params.match(/\sscode=([0-9]+)/);
                                                numMatch = params.match(/\snum=([0-9]+)/);
                                                startMatch = params.match(/\sstart=([0-9]+)/);
                                                orderMatch = params.match(/\sorder='([\w\s,]+)'/);
                                                tagsMatch = params.match(/\stags=([\w]+)/);
                                                filterMatch = params.match(/\sfilter=([\w]+)/);
                                                scode = scodeMatch ? scodeMatch[1] : scode;
                                                num = numMatch ? Number(numMatch[1]) : num;
                                                start = (this.currentPage - 1) * num;
                                                if (startMatch) {
                                                    start = Number(startMatch[1]);
                                                }
                                                tags = tagsMatch ? tagsMatch[1] : tags;
                                                filter = filterMatch ? filterMatch[1] : filter;
                                                if (orderMatch) {
                                                    order = orderMatch[1].split(',').reduce(function (pre, cur) {
                                                        if (!cur.includes(' ')) {
                                                            pre[cur] = 'ASC';
                                                            return pre;
                                                        }
                                                        var res = cur.split(' ');
                                                        pre[res[0]] = res[1].toUpperCase();
                                                        return pre;
                                                    }, {});
                                                }
                                            }
                                            return [4 /*yield*/, this.db.getSort(scode)];
                                        case 1:
                                            sort = _a.sent();
                                            return [4 /*yield*/, this.db.getContentList(scode, num, start, order)];
                                        case 2:
                                            cons = (_a.sent()).filter(function (v, i) { return i < num; });
                                            return [4 /*yield*/, this.db.getContentCount(scode, order)];
                                        case 3:
                                            counts = _a.sent();
                                            if (scode === this.pageScode) {
                                                this.pagerows = counts;
                                                this.pagecount = Math.ceil(counts / num);
                                            }
                                            if (!cons)
                                                return [2 /*return*/, res];
                                            _loop_3 = function (i) {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _a = res;
                                                            return [4 /*yield*/, tool_1.replaceAsync(content, reg2_3, function (match2, params2, p3) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var r, lenReg, len, reg, style, params2Func;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                r = cons[i][params2];
                                                                                if (!params2.includes('ext_')) return [3 /*break*/, 2];
                                                                                return [4 /*yield*/, this.db.getConExp(cons[i].id, params2)];
                                                                            case 1:
                                                                                r = _a.sent();
                                                                                _a.label = 2;
                                                                            case 2:
                                                                                if (params2 === 'content') {
                                                                                    r = tool_1.htmlDecode(r);
                                                                                }
                                                                                lenReg = /\slen=([0-9]+)/;
                                                                                if (lenReg.test(p3)) {
                                                                                    len = parseInt(p3.match(lenReg)[1]);
                                                                                    r = r.slice(0, len);
                                                                                }
                                                                                if (p3 && p3.includes('style=')) {
                                                                                    reg = /style=([Y-m-d]+)/;
                                                                                    style = p3.match(reg)[1];
                                                                                    if (style === 'Y-m') {
                                                                                        return [2 /*return*/, dayjs(r).format('YYYY-MM')];
                                                                                    }
                                                                                    else if (style === 'Y-m-d') {
                                                                                        return [2 /*return*/, dayjs(r).format('YYYY-MM-DD')];
                                                                                    }
                                                                                }
                                                                                if (r !== undefined)
                                                                                    return [2 /*return*/, r];
                                                                                params2Func = {
                                                                                    n: function () {
                                                                                        return i;
                                                                                    },
                                                                                    i: function () {
                                                                                        return i + 1;
                                                                                    },
                                                                                    link: function () {
                                                                                        return cons[i].outlink
                                                                                            ? cons[i].outlink
                                                                                            : "/content/" + cons[i].id + ".html";
                                                                                    },
                                                                                    sortname: function () {
                                                                                        return sort.name;
                                                                                    },
                                                                                    subsortname: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var sort;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getSort(cons[i].subscode)];
                                                                                                    case 1:
                                                                                                        sort = _a.sent();
                                                                                                        return [2 /*return*/, sort.name];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    sortlink: function () {
                                                                                        return "/list/" + scode + ".html";
                                                                                    },
                                                                                    subsortlink: function () {
                                                                                        return "/list/" + cons[i].subscode + ".html";
                                                                                    },
                                                                                    enclosuresize: function () {
                                                                                        return '未计算';
                                                                                    },
                                                                                    likeslink: function () {
                                                                                        return '';
                                                                                    },
                                                                                    opposelink: function () {
                                                                                        return '';
                                                                                    }
                                                                                };
                                                                                return [4 /*yield*/, params2Func[params2]()];
                                                                            case 3:
                                                                                r = _a.sent();
                                                                                return [2 /*return*/, r];
                                                                        }
                                                                    });
                                                                }); })];
                                                        case 1:
                                                            res = _a + _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            i = 0;
                                            _a.label = 4;
                                        case 4:
                                            if (!(i < cons.length)) return [3 /*break*/, 7];
                                            return [5 /*yield**/, _loop_3(i)];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            i++;
                                            return [3 /*break*/, 4];
                                        case 7: return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _b.sent();
                        throw new common_1.HttpException('parseList Error:  ' + error_9.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseContentId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg1, reg2_4, _a, error_10;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg1 = /\{lesocms:content(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:content\}/g;
                        reg2_4 = /\[content:([\w]+)(\s+[^\]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg1, function (match, params, content) { return __awaiter(_this, void 0, void 0, function () {
                                var id, scode, res, db, contentEntity, sort;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            id = parseInt(params.match(/\sid=([0-9]+)/)[1]);
                                            scode = params.match(/\sscode=([0-9]+)/)[1];
                                            res = '', db = this.db;
                                            return [4 /*yield*/, this.db.getSortContent(id, scode)];
                                        case 1:
                                            contentEntity = _a.sent();
                                            return [4 /*yield*/, this.db.getSort(scode)];
                                        case 2:
                                            sort = _a.sent();
                                            if (!contentEntity)
                                                return [2 /*return*/, res];
                                            return [4 /*yield*/, tool_1.replaceAsync(content, reg2_4, function (match2, params2) { return __awaiter(_this, void 0, void 0, function () {
                                                    var r, params2Func;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                r = contentEntity[params2];
                                                                if (params2 === 'content') {
                                                                    r = tool_1.htmlDecode(r);
                                                                }
                                                                if (!params2.includes('ext_')) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, this.db.getConExp(contentEntity.id, params2)];
                                                            case 1:
                                                                r = _a.sent();
                                                                _a.label = 2;
                                                            case 2:
                                                                if (r !== undefined)
                                                                    return [2 /*return*/, r];
                                                                params2Func = {
                                                                    link: function () {
                                                                        return contentEntity.outlink
                                                                            ? contentEntity.outlink
                                                                            : "/content/" + contentEntity.id + ".html";
                                                                    },
                                                                    sortname: function () {
                                                                        return sort.name;
                                                                    },
                                                                    subsortname: function () {
                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                            var sort;
                                                                            return __generator(this, function (_a) {
                                                                                switch (_a.label) {
                                                                                    case 0: return [4 /*yield*/, db.getSort(contentEntity.subscode)];
                                                                                    case 1:
                                                                                        sort = _a.sent();
                                                                                        return [2 /*return*/, sort.name];
                                                                                }
                                                                            });
                                                                        });
                                                                    },
                                                                    sortlink: function () {
                                                                        return "/list/" + contentEntity.scode + ".html";
                                                                    },
                                                                    subsortlink: function () {
                                                                        return "/list/" + contentEntity.subscode + ".html";
                                                                    },
                                                                    enclosuresize: function () {
                                                                        return '未计算';
                                                                    },
                                                                    likeslink: function () {
                                                                        return '';
                                                                    },
                                                                    opposelink: function () {
                                                                        return '';
                                                                    }
                                                                };
                                                                return [4 /*yield*/, params2Func[params2]()];
                                                            case 3:
                                                                r = _a.sent();
                                                                return [2 /*return*/, r];
                                                        }
                                                    });
                                                }); })];
                                        case 3:
                                            res = _a.sent();
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _b.sent();
                        throw new common_1.HttpException('parseContentId Error:  ' + error_10.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parsePage = function () {
        try {
            if (!this.pagerows && this.pagerows !== 0)
                return;
            var reg = /\{page:([\w]+)\}/g;
            var search_1 = this.search;
            var current_1 = this.currentPage;
            var scode_1 = this.pageScode ? this.pageScode : this.searchScode;
            var type_1 = this.searchScode ? 'search' : 'list';
            var count_1 = this.pagecount;
            var rows_1 = this.pagerows;
            this.newHtml = this.newHtml.replace(reg, function (match, params) {
                var paramsFunc = {
                    bar: function () {
                        var index = this.index();
                        var last = this.last();
                        var pre = this.pre();
                        var next = this.next();
                        var status = this.status();
                        var numbar = this.numbar();
                        return "\n\t\t\t\t\t\t\t<span class='page-status'>" + status + "</span>\n\t\t\t\t\t\t\t<span class='page-index'><a href='" + index + "'>\u9996\u9875</a></span>\n\t\t\t\t\t\t\t<span class='page-pre'><a href='" + pre + "'>\u524D\u4E00\u9875</a></span>\n\t\t\t\t\t\t\t<span class='page-numbar'>\n\t\t\t\t\t\t\t" + numbar + "\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class='page-next'><a href='" + next + "'>\u540E\u4E00\u9875</a></span>\n\t\t\t\t\t\t\t<span class='page-last'><a href='" + last + "'>\u5C3E\u9875</a></span>\n\t\t\t\t\t\t\t";
                    },
                    current: function () {
                        if (current_1 > count_1) {
                            return count_1;
                        }
                        else {
                            return current_1;
                        }
                    },
                    count: function () {
                        return count_1;
                    },
                    rows: function () {
                        return rows_1;
                    },
                    index: function () {
                        if (type_1 === 'search') {
                            return '/Search/index.html' + search_1;
                        }
                        return "/list/" + scode_1 + "/page/1.html";
                    },
                    pre: function () {
                        var current = this.current();
                        if (current > 1) {
                            if (type_1 === 'search') {
                                return "/Search/index.html/page/" + (current - 1) + ".html" + search_1;
                            }
                            return "/list/" + scode_1 + "/page/" + (current - 1) + ".html";
                        }
                        else {
                            return 'javascript:;';
                        }
                    },
                    next: function () {
                        var current = this.current();
                        if (current < count_1) {
                            if (type_1 === 'search') {
                                return "/Search/index.html/page/" + (current + 1) + ".html" + search_1;
                            }
                            return "/list/" + scode_1 + "/page/" + (current + 1) + ".html";
                        }
                        else {
                            return 'javascript:;';
                        }
                    },
                    last: function () {
                        if (type_1 === 'search') {
                            return ("/Search/index.html/page/" + (count_1 ? count_1 : 1) + ".html" + search_1);
                        }
                        return "/list/" + scode_1 + "/page/" + (count_1 ? count_1 : 1) + ".html";
                    },
                    status: function () {
                        return "\u5171" + count_1 + "\u6761 \u5F53\u524D" + this.current() + "/" + count_1 + "\u9875";
                    },
                    numbar: function () {
                        var res = '';
                        var current = this.current();
                        for (var i = 1; i - 1 < count_1; i++) {
                            if (current === i) {
                                if (type_1 === 'search') {
                                    res += "\n\t\t\t\t\t\t\t\t\t\t<a href=\"/Search/index.html/page/" + i + ".html" + search_1 + "\" class=\"page-num page-num-current\">" + i + "</a>\n\t\t\t\t\t\t\t\t\t\t";
                                }
                                else {
                                    res += "\n\t\t\t\t\t\t\t\t\t\t<a href=\"/list/" + scode_1 + "/page/" + i + ".html\" class=\"page-num page-num-current\">" + i + "</a>\n\t\t\t\t\t\t\t\t\t\t";
                                }
                            }
                            else {
                                if (type_1 === 'search') {
                                    res += "\n\t\t\t\t\t\t\t\t<a href=\"/Search/index.html/page/" + i + ".html" + search_1 + "\" class=\"page-num \">" + i + "</a>\n\t\t\t\t\t\t\t\t";
                                }
                                else {
                                    res += "\n\t\t\t\t\t\t\t\t<a href=\"/list/" + scode_1 + "/page/" + i + ".html\" class=\"page-num \">" + i + "</a>\n\t\t\t\t\t\t\t\t";
                                }
                            }
                        }
                        return res;
                    },
                    selectbar: function () {
                        var current = this.current();
                        var res = '<select onchange="changepage(this)" lay-ignore>';
                        for (var i = 1; i - 1 < count_1; i++) {
                            if (current === i) {
                                res += "\n\t\t\t\t\t\t\t\t\t<option value=\"" + i + "\" selected=\"selected\">\u8DF3\u5230" + i + "\u9875</option>\n\t\t\t\t\t\t\t\t\t";
                            }
                            else {
                                res += "\n\t\t\t\t\t\t\t\t<option value=\"" + i + "\">\u8DF3\u5230" + i + "\u9875</option>\n\t\t\t\t\t\t\t\t";
                            }
                        }
                        if (type_1 === 'search') {
                            res += "<script>function changepage(tag){window.location.href=\"/Search/index.html/page/\"+tag.value+\".html" + search_1 + "\";}</script>";
                        }
                        else {
                            res += "<script>function changepage(tag){window.location.href=\"/list/" + scode_1 + "/page/\"+tag.value+\".html\";}</script>";
                        }
                        return res;
                    }
                };
                return paramsFunc[params]();
            });
        }
        catch (error) {
            throw new common_1.HttpException('parsePage Error:  ' + error.message, 500);
        }
    };
    Parser.prototype.parsePics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, reg2_5, _a, error_11;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg = /\{lesocms:pics(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:pics\}/g;
                        reg2_5 = /\[pics:([\w]+)(\s+[^\]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params, text) { return __awaiter(_this, void 0, void 0, function () {
                                var reg_id, reg_num, num, id, picsStr, pics, res, _loop_4, i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            reg_id = /\sid=([0-9]+)/;
                                            reg_num = /\snum=([0-9]+)/;
                                            if (!reg_id.test(params))
                                                return [2 /*return*/, match];
                                            num = 9999;
                                            id = parseInt(params.match(reg_id)[1]);
                                            if (reg_num.test(params)) {
                                                num = parseInt(params.match(reg_num)[1]);
                                            }
                                            return [4 /*yield*/, this.db.getContentPics(id)];
                                        case 1:
                                            picsStr = _a.sent();
                                            pics = picsStr.split(',').filter(function (v, i) { return i < num; });
                                            res = '';
                                            _loop_4 = function (i) {
                                                res += text.replace(reg2_5, function (match, params) {
                                                    var paramsFunc = {
                                                        get n() {
                                                            return i;
                                                        },
                                                        get i() {
                                                            return i + 1;
                                                        },
                                                        get src() {
                                                            return pics[i];
                                                        }
                                                    };
                                                    return paramsFunc[params];
                                                });
                                            };
                                            for (i = 0; i < pics.length; i++) {
                                                _loop_4(i);
                                            }
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _b.sent();
                        throw new common_1.HttpException('parsePics Error:  ' + error_11.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseSlide = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, reg2_6, _a, error_12;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reg = /\{lesocms:slide(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:slide\}/g;
                        reg2_6 = /\[slide:([\w]+)(\s+[^\]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg, function (match, params, text) { return __awaiter(_this, void 0, void 0, function () {
                                var reg_gid, reg_num, num, gid, picsStr, pics, res, _loop_5, i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            reg_gid = /\sgid=([0-9]+)/;
                                            reg_num = /\snum=([0-9]+)/;
                                            if (!reg_gid.test(params))
                                                return [2 /*return*/, match];
                                            num = 5;
                                            gid = parseInt(params.match(reg_gid)[1]);
                                            if (reg_num.test(params)) {
                                                num = parseInt(params.match(reg_num)[1]);
                                            }
                                            return [4 /*yield*/, this.db.getSlides(gid, num)];
                                        case 1:
                                            picsStr = _a.sent();
                                            pics = picsStr.map(function (v) { return v.pic; });
                                            res = '';
                                            _loop_5 = function (i) {
                                                res += text.replace(reg2_6, function (match, params) {
                                                    var paramsFunc = {
                                                        get n() {
                                                            return i;
                                                        },
                                                        get i() {
                                                            return i + 1;
                                                        },
                                                        get src() {
                                                            return pics[i];
                                                        },
                                                        get id() {
                                                            return picsStr[i].id;
                                                        },
                                                        get link() {
                                                            return picsStr[i].link;
                                                        },
                                                        get title() {
                                                            return picsStr[i].title;
                                                        },
                                                        get subtitle() {
                                                            return picsStr[i].subtitle;
                                                        }
                                                    };
                                                    return paramsFunc[params];
                                                });
                                            };
                                            for (i = 0; i < pics.length; i++) {
                                                _loop_5(i);
                                            }
                                            return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _b.sent();
                        throw new common_1.HttpException('parseSlide Error:  ' + error_12.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg1, reg2_7, _a, error_13;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.type !== 'search')
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        reg1 = /\{lesocms:search(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:search\}/g;
                        reg2_7 = /\[search:([\w]+)(\s+[^]]+)?\]/g;
                        _a = this;
                        return [4 /*yield*/, tool_1.replaceAsync(this.newHtml, reg1, function (match, params, content) { return __awaiter(_this, void 0, void 0, function () {
                                var scode, keyword, num, order, tags, filter, start, res, db, scodeMatch, numMatch, startMatch, orderMatch, tagsMatch, filterMatch, sort, total, cons, counts, _loop_6, i;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scode = this.searchScode, keyword = this.searchKeyword, num = 9999, order = {}, tags = '', filter = '', start = 0, res = '', db = this.db;
                                            if (params) {
                                                scodeMatch = params.match(/\sscode=([0-9]+)/);
                                                numMatch = params.match(/\snum=([0-9]+)/);
                                                startMatch = params.match(/\sstart=([0-9]+)/);
                                                orderMatch = params.match(/\sorder='([\w\s,]+)'/);
                                                tagsMatch = params.match(/\stags=([\w]+)/);
                                                filterMatch = params.match(/\sfilter=([\w]+)/);
                                                scode = scodeMatch ? scodeMatch[1] : scode;
                                                num = numMatch ? Number(numMatch[1]) : num;
                                                start = (this.currentPage - 1) * num;
                                                if (startMatch) {
                                                    start = Number(startMatch[1]);
                                                }
                                                tags = tagsMatch ? tagsMatch[1] : tags;
                                                filter = filterMatch ? filterMatch[1] : filter;
                                                if (orderMatch) {
                                                    order = orderMatch[1].split(',').reduce(function (pre, cur) {
                                                        if (!cur.includes(' ')) {
                                                            pre[cur] = 'ASC';
                                                            return pre;
                                                        }
                                                        var res = cur.split(' ');
                                                        pre[res[0]] = res[1].toUpperCase();
                                                        return pre;
                                                    }, {});
                                                }
                                            }
                                            return [4 /*yield*/, this.db.getSort(scode)];
                                        case 1:
                                            sort = _a.sent();
                                            return [4 /*yield*/, this.db.findContentList(scode, keyword, order)];
                                        case 2:
                                            total = _a.sent();
                                            cons = total.filter(function (v, i) { return i >= start && i < _this.currentPage * num; });
                                            counts = total.length;
                                            this.pagerows = counts;
                                            this.pagecount = Math.ceil(counts / num);
                                            if (!cons)
                                                return [2 /*return*/, res];
                                            _loop_6 = function (i) {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _a = res;
                                                            return [4 /*yield*/, tool_1.replaceAsync(content, reg2_7, function (match2, params2, p3) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var r, lenReg, len, params2Func;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                r = cons[i][params2];
                                                                                if (!params2.includes('ext_')) return [3 /*break*/, 2];
                                                                                return [4 /*yield*/, this.db.getConExp(cons[i].id, params2)];
                                                                            case 1:
                                                                                r = _a.sent();
                                                                                _a.label = 2;
                                                                            case 2:
                                                                                if (params2 === 'content') {
                                                                                    r = tool_1.htmlDecode(r);
                                                                                }
                                                                                lenReg = /\slen=([0-9]+)/;
                                                                                if (lenReg.test(p3)) {
                                                                                    len = parseInt(p3.match(lenReg)[1]);
                                                                                    r = r.slice(0, len);
                                                                                }
                                                                                if (r !== undefined)
                                                                                    return [2 /*return*/, r];
                                                                                params2Func = {
                                                                                    n: function () {
                                                                                        return i;
                                                                                    },
                                                                                    i: function () {
                                                                                        return i + 1;
                                                                                    },
                                                                                    link: function () {
                                                                                        return cons[i].outlink
                                                                                            ? cons[i].outlink
                                                                                            : "/content/" + cons[i].id + ".html";
                                                                                    },
                                                                                    sortname: function () {
                                                                                        return sort.name;
                                                                                    },
                                                                                    subsortname: function () {
                                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                                            var sort;
                                                                                            return __generator(this, function (_a) {
                                                                                                switch (_a.label) {
                                                                                                    case 0: return [4 /*yield*/, db.getSort(cons[i].subscode)];
                                                                                                    case 1:
                                                                                                        sort = _a.sent();
                                                                                                        return [2 /*return*/, sort.name];
                                                                                                }
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    sortlink: function () {
                                                                                        return "/list/" + scode + ".html";
                                                                                    },
                                                                                    subsortlink: function () {
                                                                                        return "/list/" + cons[i].subscode + ".html";
                                                                                    },
                                                                                    enclosuresize: function () {
                                                                                        return '未计算';
                                                                                    },
                                                                                    likeslink: function () {
                                                                                        return '';
                                                                                    },
                                                                                    opposelink: function () {
                                                                                        return '';
                                                                                    }
                                                                                };
                                                                                return [4 /*yield*/, params2Func[params2]()];
                                                                            case 3:
                                                                                r = _a.sent();
                                                                                return [2 /*return*/, r];
                                                                        }
                                                                    });
                                                                }); })];
                                                        case 1:
                                                            res = _a + _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            i = 0;
                                            _a.label = 3;
                                        case 3:
                                            if (!(i < cons.length)) return [3 /*break*/, 6];
                                            return [5 /*yield**/, _loop_6(i)];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            i++;
                                            return [3 /*break*/, 3];
                                        case 6: return [2 /*return*/, res];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.newHtml = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _b.sent();
                        throw new common_1.HttpException('parseList Error:  ' + error_13.message, 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Parser.prototype.parseOther = function () {
        try {
            var reg = /\{lesocms:([\w]+)\}/g;
            var keyword_1 = this.searchKeyword;
            var url_1 = this.host + this.url;
            this.newHtml = this.newHtml.replace(reg, function (match, params, params2) {
                var paramsFunc = {
                    get lgpath() {
                        return '/Do/area.html';
                    },
                    get scaction() {
                        return '/Search/index.html';
                    },
                    get keyword() {
                        return keyword_1;
                    },
                    get msgaction() {
                        return '/Message/add.html';
                    },
                    get httpurl() {
                        return url_1;
                    }
                };
                if (paramsFunc[params]) {
                    return paramsFunc[params];
                }
                return match;
            });
        }
        catch (error) {
            throw new common_1.HttpException('parseOther Error:  ' + error.message, 500);
        }
    };
    Parser.prototype.parseQrcode = function () {
        try {
            var reg = /\{lesocms:qrcode(\s+[^}]+)?\}/g;
            this.newHtml = this.newHtml.replace(reg, function (match, params) {
                var m = params.match(/string=(.+)/);
                if (m) {
                    return "<img src=\"http://qr.kegood.com/?m=2&e=L&p=5&url=" + m[1] + "\" class=\"qrcode\" >";
                }
                else {
                    return '';
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException('parseQRCODE Error:  ' + error.message, 500);
        }
    };
    Parser.prototype.parseIf = function () {
        try {
            var reg = /\{lesocms:if\(([^}^\$]+)\)\}([\s\S]*?)\{\/lesocms:if\}/g;
            var reg2_8 = /lesocms:([0-9])+if/g;
            var deep_2 = false;
            this.newHtml = this.newHtml.replace(reg, function (match, params, content) {
                var isTrue = eval(params), res = '';
                var reg_content = /([\s\S]*)?\{else\}([\s\S]*)?/;
                if (reg_content.test(content)) {
                    var trueContent = content.match(reg_content)[1];
                    var falseContent = content.match(reg_content)[2];
                    if (isTrue) {
                        res = trueContent;
                    }
                    else {
                        res = falseContent;
                    }
                }
                else {
                    if (isTrue) {
                        res = content;
                    }
                }
                if (reg2_8.test(res)) {
                    deep_2 = true;
                    var reg3 = /([0-9])+if/g;
                    deep_2 = true;
                    res = res.replace(reg3, function (match, n) {
                        if (Number(n) > 1) {
                            var d = void 0;
                            if (Number(n) - 1 === 1) {
                                d = '';
                            }
                            else {
                                d = Number(n) - 1;
                            }
                            return d + "if";
                        }
                        return match;
                    });
                }
                return res;
            });
            if (deep_2) {
                this.parseIf();
            }
        }
        catch (error) {
            throw new common_1.HttpException('parseIf Error:  ' + error.message, 500);
        }
    };
    Parser.prototype.parseLoop = function () {
        try {
            var reg = /\{lesocms:loop(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:loop\}/;
            this.newHtml = this.newHtml.replace(reg, function (match, params, content) {
                var start, end, res = '';
                try {
                    start = parseInt(params.match(/\sstart=([0-9]+)/)[1]);
                    end = parseInt(params.match(/\send=([0-9]+)/)[1]);
                    var index_1 = 0;
                    var _loop_7 = function (i) {
                        index_1++;
                        res += content.replace(/\[loop:([\w]+)\]/g, function (match2, params2) {
                            if (params2 === 'i') {
                                return i.toString();
                            }
                            if (params2 === 'index') {
                                return index_1.toString();
                            }
                            return '';
                        });
                    };
                    for (var i = start; i <= end; i++) {
                        _loop_7(i);
                    }
                    return res;
                }
                catch (error) {
                    return res;
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException('parseLoop Error:  ' + error.message, 500);
        }
    };
    Parser.prototype.parsePosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reg, sort_2, error_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.pageScode)
                            return [2 /*return*/];
                        reg = /\{lesocms:position(\s+[^}]+)?\}/g;
                        return [4 /*yield*/, this.db.getPosition(this.pageScode)];
                    case 1:
                        sort_2 = _a.sent();
                        this.newHtml = this.newHtml.replace(reg, function (match, params) {
                            var separator = ' >> ', separatoricon, indextext = '首页', indexicon;
                            if (params) {
                                if (params.includes('separator')) {
                                    separator = params.match(/\sseparator=([\S]+)/)[1];
                                }
                                if (params.includes('separatoricon')) {
                                    separatoricon = params.match(/\sseparatoricon=([\S]+)/)[1];
                                    separator = "<i class=\"" + separatoricon + "\"></i>";
                                }
                                if (params.includes('indextext')) {
                                    indextext = params.match(/\sindextext=([\S]+)/)[1];
                                }
                                if (params.includes('indexicon')) {
                                    indexicon = params.match(/\sindexicon=([\S]+)/)[1];
                                    indextext = "<i class=\"" + indexicon + "\"></i>";
                                }
                            }
                            var position = sort_2.reduce(function (pre, cur) {
                                var name = cur.name;
                                var type;
                                if (_this.type === 'content') {
                                    type = 'list';
                                }
                                else {
                                    type = _this.type;
                                }
                                var link = cur.outlink ? cur.outlink : "/" + type + "/" + cur.scode + '.html';
                                var a = "<a href=\"" + link + "\">" + name + "</a>";
                                pre = pre + separator + a;
                                return pre;
                            }, "<a href=\"/\">" + indextext + "</a>");
                            return position;
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        throw new common_1.HttpException('parsePosition Error:  ' + error_14.message, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Parser;
}());
exports.Parser = Parser;
