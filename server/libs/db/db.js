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
exports.Db = void 0;
var typeorm_1 = require("typeorm");
var path_1 = require("path");
var label_entity_1 = require("./entities/label.entity");
var content_sort_entity_1 = require("./entities/content_sort.entity");
var content_entity_1 = require("./entities/content.entity");
var company_entity_1 = require("./entities/company.entity");
var site_entity_1 = require("./entities/site.entity");
var slide_entity_1 = require("./entities/slide.entity");
var message_entity_1 = require("./entities/message.entity");
var extfield_entity_1 = require("./entities/extfield.entity");
var area_entity_1 = require("./entities/area.entity");
var user_entity_1 = require("./entities/user.entity");
var tool_1 = require("../common/tool");
var common_1 = require("@nestjs/common");
var model_entity_1 = require("./entities/model.entity");
var Db = /** @class */ (function () {
    function Db(sitetplpath) {
        this.sitetplpath = sitetplpath;
    }
    Db.prototype.linkDb = function () {
        return __awaiter(this, void 0, Promise, function () {
            var sitePath, name, dbPath, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sitePath = this.sitetplpath.match(/\/Sites\/.*?\//)[0];
                        name = sitePath.replace(/\/Sites\/|\//g, '');
                        dbPath = path_1.join(__dirname, '../../../', sitePath, 'data/878490a6ab380cf5bb4e7c97387e6850.db');
                        this.name = name;
                        if (!(typeorm_1.getConnectionManager().has(name) &&
                            typeorm_1.getConnectionManager().get(name).isConnected)) return [3 /*break*/, 1];
                        this.connection = typeorm_1.getConnectionManager().get(name);
                        return [3 /*break*/, 3];
                    case 1:
                        _a = this;
                        return [4 /*yield*/, typeorm_1.createConnection({
                                name: name,
                                type: 'sqlite',
                                database: dbPath,
                                entities: [
                                    label_entity_1.Label,
                                    content_sort_entity_1.ContentSortEntity,
                                    content_entity_1.ContentEntity,
                                    company_entity_1.CompanyEntity,
                                    site_entity_1.SiteEntity,
                                    slide_entity_1.SlideEntity,
                                    message_entity_1.MessageEntity,
                                    extfield_entity_1.ExtfieldEntity,
                                    area_entity_1.AreaEntity,
                                    user_entity_1.UserEntity,
                                    model_entity_1.ModelEntity
                                ],
                                cache: {
                                    duration: 30000
                                }
                            })];
                    case 2:
                        _a.connection = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.setContentExt(name, dbPath)];
                    case 4:
                        _b.sent();
                        this.areaRep = this.connection.getRepository(area_entity_1.AreaEntity);
                        this.conRep = this.connection.getRepository(content_entity_1.ContentEntity);
                        this.sortRep = this.connection.getRepository(content_sort_entity_1.ContentSortEntity);
                        this.labelRep = this.connection.getRepository(label_entity_1.Label);
                        this.comRep = this.connection.getRepository(company_entity_1.CompanyEntity);
                        this.siteRep = this.connection.getRepository(site_entity_1.SiteEntity);
                        this.slideRep = this.connection.getRepository(slide_entity_1.SlideEntity);
                        this.msgRep = this.connection.getRepository(message_entity_1.MessageEntity);
                        this.userRep = this.connection.getRepository(user_entity_1.UserEntity);
                        this.modelRep = this.connection.getRepository(model_entity_1.ModelEntity);
                        return [2 /*return*/];
                }
            });
        });
    };
    Db.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Db.prototype.getSite = function (acode) {
        return __awaiter(this, void 0, void 0, function () {
            var siteEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.siteRep.findOne({ where: { acode: acode } })];
                    case 1:
                        siteEntity = _a.sent();
                        return [2 /*return*/, siteEntity];
                }
            });
        });
    };
    Db.prototype.getCompany = function (acode) {
        return __awaiter(this, void 0, void 0, function () {
            var companyEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.comRep.findOne({ where: { acode: acode } })];
                    case 1:
                        companyEntity = _a.sent();
                        return [2 /*return*/, companyEntity];
                }
            });
        });
    };
    Db.prototype.getLabel = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var labelEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.labelRep.findOne({ where: { name: label } })];
                    case 1:
                        labelEntity = _a.sent();
                        return [2 /*return*/, labelEntity];
                }
            });
        });
    };
    Db.prototype.getLabels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var labels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.labelRep.find()];
                    case 1:
                        labels = _a.sent();
                        return [2 /*return*/, labels];
                }
            });
        });
    };
    Db.prototype.addLabel = function (name, type, description) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = this.labelRep.create({
                            name: name,
                            type: type,
                            description: description
                        });
                        return [4 /*yield*/, this.labelRep.save(label)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.deleteLable = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.labelRep["delete"]({ name: label })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.updateLable = function (name, value) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.labelRep.findOne({ name: name })];
                    case 1:
                        label = _a.sent();
                        label.value = value;
                        return [4 /*yield*/, this.labelRep.save(label)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.getSort = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sortEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortRep.findOne({
                            where: { scode: scode, status: '1' }
                        })];
                    case 1:
                        sortEntity = _a.sent();
                        return [2 /*return*/, sortEntity];
                }
            });
        });
    };
    Db.prototype.getSortList = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sortEntity, pcode, sortList, pSort;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSort(scode)];
                    case 1:
                        sortEntity = _a.sent();
                        pcode = sortEntity.pcode, sortList = [sortEntity];
                        _a.label = 2;
                    case 2:
                        if (!(pcode !== '0')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sortRep.findOne({
                                where: { scode: pcode, status: '1' }
                            })];
                    case 3:
                        pSort = _a.sent();
                        pcode = pSort.pcode;
                        sortList.unshift(pSort);
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, sortList];
                }
            });
        });
    };
    Db.prototype.getTopSort = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sortList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortList(scode)];
                    case 1:
                        sortList = _a.sent();
                        return [2 /*return*/, sortList[0]];
                }
            });
        });
    };
    Db.prototype.getParentSort = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sortList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortList(scode)];
                    case 1:
                        sortList = _a.sent();
                        if (sortList.length === 1)
                            return [2 /*return*/, sortList[0]];
                        return [2 /*return*/, sortList.reverse[1]];
                }
            });
        });
    };
    Db.prototype.getPosition = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sortList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortList(scode)];
                    case 1:
                        sortList = _a.sent();
                        return [2 /*return*/, sortList];
                }
            });
        });
    };
    Db.prototype.getSubScodes = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var subScodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortRep.find({
                            where: { pcode: scode, status: '1' },
                            order: { sorting: 'ASC' }
                        })];
                    case 1:
                        subScodes = _a.sent();
                        return [2 /*return*/, subScodes];
                }
            });
        });
    };
    Db.prototype.findContentList = function (scode, keyword, order) {
        if (order === void 0) { order = {
            istop: 'DESC',
            isrecommend: 'DESC',
            isheadline: 'DESC',
            sorting: 'ASC',
            date: 'DESC',
            id: 'DESC'
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var list, subSorts, i, subLists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conRep.find({
                            order: order,
                            where: {
                                scode: scode,
                                status: '1',
                                title: typeorm_1.Like("%" + keyword + "%")
                            }
                        })];
                    case 1:
                        list = _a.sent();
                        return [4 /*yield*/, this.getSubScodes(scode)];
                    case 2:
                        subSorts = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < subSorts.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.findContentList(subSorts[i].scode, keyword, order)];
                    case 4:
                        subLists = _a.sent();
                        list.push.apply(list, subLists);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, list];
                }
            });
        });
    };
    Db.prototype.getContentList = function (scode, num, start, order, tags) {
        if (order === void 0) { order = {
            istop: 'DESC',
            isrecommend: 'DESC',
            isheadline: 'DESC',
            sorting: 'ASC',
            date: 'DESC',
            id: 'DESC'
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var where, list, subSorts, i, subLists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = [{ scode: scode, status: '1' }];
                        if (tags) {
                            where = tags.map(function (v) {
                                return { tags: v, scode: scode, status: '1' };
                            });
                        }
                        return [4 /*yield*/, this.conRep.find({
                                order: order,
                                where: where,
                                skip: start,
                                take: num
                            })];
                    case 1:
                        list = _a.sent();
                        return [4 /*yield*/, this.getSubScodes(scode)];
                    case 2:
                        subSorts = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < subSorts.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getContentList(subSorts[i].scode, num, 0, order)];
                    case 4:
                        subLists = _a.sent();
                        list.push.apply(list, subLists);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, list];
                }
            });
        });
    };
    Db.prototype.getContentCount = function (scode, order, tags) {
        return __awaiter(this, void 0, void 0, function () {
            var where, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = [{ scode: scode }];
                        if (tags) {
                            where = tags.map(function (v) {
                                return { tags: v, scode: scode, status: '1' };
                            });
                        }
                        return [4 /*yield*/, this.conRep.count({
                                order: order,
                                where: where
                            })];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    Db.prototype.getContent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conRep.findOne({ where: { id: id, status: '1' } })];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content];
                }
            });
        });
    };
    // 单片详情
    Db.prototype.getAbout = function (scode) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conRep.findOne({
                            where: { scode: scode, status: '1' }
                        })];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content];
                }
            });
        });
    };
    // 指定内容多图
    Db.prototype.getContentPics = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContent(id)];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content.pics];
                }
            });
        });
    };
    Db.prototype.getContentPre = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var content, scode, pre;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContent(id)];
                    case 1:
                        content = _a.sent();
                        scode = content.scode;
                        return [4 /*yield*/, this.getContent(id - 1)];
                    case 2:
                        pre = _a.sent();
                        if (pre && pre.scode == scode) {
                            return [2 /*return*/, pre];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Db.prototype.getContentNext = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var content, scode, pre;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContent(id)];
                    case 1:
                        content = _a.sent();
                        scode = content.scode;
                        return [4 /*yield*/, this.getContent(id + 1)];
                    case 2:
                        pre = _a.sent();
                        if (pre && pre.scode == scode) {
                            return [2 /*return*/, pre];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Db.prototype.getSortContent = function (id, scode) {
        return __awaiter(this, void 0, void 0, function () {
            var sort;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conRep.findOne({ where: { id: id, scode: scode } })];
                    case 1:
                        sort = _a.sent();
                        if (!!sort) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.conRep.findOne({ where: { id: id } })];
                    case 2:
                        sort = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, sort];
                }
            });
        });
    };
    Db.prototype.getSlides = function (gid, number) {
        return __awaiter(this, void 0, void 0, function () {
            var slides;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.slideRep.find({
                            where: { gid: gid },
                            take: number
                        })];
                    case 1:
                        slides = _a.sent();
                        return [2 /*return*/, slides];
                }
            });
        });
    };
    Db.prototype.getMessage = function (num, start, acode) {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.msgRep.find({
                            where: { acode: acode },
                            skip: start,
                            take: num
                        })];
                    case 1:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        });
    };
    Db.prototype.getConExp = function (contentid, name) {
        return __awaiter(this, void 0, void 0, function () {
            var conExp, exp, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conExtRep.findOne({ where: { contentid: contentid } })];
                    case 1:
                        conExp = _a.sent();
                        return [4 /*yield*/, this.extRep.findOne({ where: { name: name } })];
                    case 2:
                        exp = _a.sent();
                        if (!conExp) {
                            return [2 /*return*/, ''];
                        }
                        if (exp.type === '8') {
                            res = tool_1.htmlDecode(conExp[name]);
                        }
                        else {
                            res = conExp[name];
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Db.prototype.getDefaultArea = function () {
        return __awaiter(this, void 0, void 0, function () {
            var area;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.areaRep.findOne({ where: { is_default: '1' } })];
                    case 1:
                        area = _a.sent();
                        return [2 /*return*/, area];
                }
            });
        });
    };
    Db.prototype.getAreaLanguage = function (acode) {
        return __awaiter(this, void 0, void 0, function () {
            var area;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.areaRep.findOne({ where: { acode: acode } })];
                    case 1:
                        area = _a.sent();
                        return [2 /*return*/, area.name];
                }
            });
        });
    };
    Db.prototype.setContentExt = function (name, dbPath) {
        return __awaiter(this, void 0, void 0, function () {
            var exts, SchemaOptions, ContentExtSchema, error_1, _a, error_2, error_3, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.extRep = this.connection.getRepository(extfield_entity_1.ExtfieldEntity);
                        return [4 /*yield*/, this.extRep.find()];
                    case 1:
                        exts = _c.sent();
                        if (!exts)
                            return [2 /*return*/];
                        SchemaOptions = {
                            name: 'ay_content_ext',
                            columns: {
                                extid: {
                                    type: Number,
                                    primary: true,
                                    generated: true
                                },
                                contentid: { type: Number }
                            }
                        };
                        exts.map(function (v) {
                            SchemaOptions.columns[v.name] = { type: String };
                        });
                        ContentExtSchema = new typeorm_1.EntitySchema(SchemaOptions);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.connection.close()];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        console.log('1--------------');
                        return [3 /*break*/, 5];
                    case 5:
                        _c.trys.push([5, 7, , 13]);
                        _a = this;
                        return [4 /*yield*/, typeorm_1.createConnection({
                                name: name,
                                type: 'sqlite',
                                database: dbPath,
                                entities: [
                                    ContentExtSchema,
                                    label_entity_1.Label,
                                    content_sort_entity_1.ContentSortEntity,
                                    content_entity_1.ContentEntity,
                                    company_entity_1.CompanyEntity,
                                    site_entity_1.SiteEntity,
                                    slide_entity_1.SlideEntity,
                                    message_entity_1.MessageEntity,
                                    extfield_entity_1.ExtfieldEntity,
                                    area_entity_1.AreaEntity,
                                    user_entity_1.UserEntity,
                                    model_entity_1.ModelEntity
                                ],
                                cache: {
                                    duration: 30000
                                }
                            })];
                    case 6:
                        _a.connection = _c.sent();
                        this.conExtRep = this.connection.getRepository(ContentExtSchema);
                        this.extRep = this.connection.getRepository(extfield_entity_1.ExtfieldEntity);
                        return [3 /*break*/, 13];
                    case 7:
                        error_2 = _c.sent();
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, typeorm_1.getConnectionManager().get(name).close()];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _c.sent();
                        console.log(error_3.message);
                        console.log('-------------------');
                        return [3 /*break*/, 11];
                    case 11:
                        _b = this;
                        return [4 /*yield*/, typeorm_1.createConnection({
                                name: name,
                                type: 'sqlite',
                                database: dbPath,
                                entities: [
                                    ContentExtSchema,
                                    label_entity_1.Label,
                                    content_sort_entity_1.ContentSortEntity,
                                    content_entity_1.ContentEntity,
                                    company_entity_1.CompanyEntity,
                                    site_entity_1.SiteEntity,
                                    slide_entity_1.SlideEntity,
                                    message_entity_1.MessageEntity,
                                    extfield_entity_1.ExtfieldEntity,
                                    area_entity_1.AreaEntity,
                                    user_entity_1.UserEntity,
                                    model_entity_1.ModelEntity
                                ],
                                cache: {
                                    duration: 30000
                                }
                            })];
                    case 12:
                        _b.connection = _c.sent();
                        this.conExtRep = this.connection.getRepository(ContentExtSchema);
                        this.extRep = this.connection.getRepository(extfield_entity_1.ExtfieldEntity);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Db.prototype.getTemplate = function (scode, id) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSort(scode)];
                    case 1:
                        sort = _a.sent();
                        if (!sort)
                            return [2 /*return*/, null];
                        template = id
                            ? sort.contenttpl
                            : sort.listtpl;
                        return [2 /*return*/, template];
                }
            });
        });
    };
    Db.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRep.findOne({ where: { username: username } })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    Db.prototype.getRepAllData = function (rep, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[rep].find({ where: query })];
                    case 1: 
                    //@ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.addRepData = function (rep, data) {
        return __awaiter(this, void 0, void 0, function () {
            var entity, afterInsert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[rep].create(data)
                        //@ts-ignore
                    ];
                    case 1:
                        entity = _a.sent();
                        return [4 /*yield*/, this[rep].save(entity)
                            //@ts-ignore
                        ];
                    case 2:
                        afterInsert = _a.sent();
                        return [4 /*yield*/, this[rep].save(afterInsert)];
                    case 3: 
                    //@ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.updataRepData = function (rep, findOption, data) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[rep].findOne(findOption)];
                    case 1:
                        entity = _a.sent();
                        Object.keys(data).forEach(function (key) {
                            if (entity[key] === undefined) {
                                throw new common_1.HttpException('添加参数错误', 403);
                            }
                            entity[key] = data[key];
                        });
                        return [4 /*yield*/, this[rep].save(entity)];
                    case 2: 
                    //@ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.deleteRepData = function (rep, findOption) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[rep]["delete"](findOption)];
                    case 1: 
                    //@ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.getContentData = function (findOption) {
        return __awaiter(this, void 0, void 0, function () {
            var start, end, _a, cons, count_1, consList_1, sorts, sortsScodes, _b, cts, count, consList;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        start = findOption.skip;
                        end = findOption.take;
                        delete findOption.skip;
                        delete findOption.take;
                        if (findOption.where.title) {
                            findOption.where.title = typeorm_1.Like("%" + findOption.where.title + "%");
                        }
                        if (!findOption.where.scode) return [3 /*break*/, 2];
                        delete findOption.where.mcode;
                        return [4 /*yield*/, this.conRep.findAndCount(__assign(__assign({}, findOption), { order: { sorting: 'ASC' } }))];
                    case 1:
                        _a = _c.sent(), cons = _a[0], count_1 = _a[1];
                        consList_1 = cons.splice(start, end);
                        return [2 /*return*/, {
                                list: consList_1,
                                count: count_1
                            }];
                    case 2: return [4 /*yield*/, this.sortRep.find({ where: { mcode: findOption.where.mcode }, order: { sorting: 'ASC' } })];
                    case 3:
                        sorts = _c.sent();
                        delete findOption.where.mcode;
                        sortsScodes = sorts.map(function (v) { return v.scode; });
                        findOption.where.scode = typeorm_1.In(sortsScodes);
                        return [4 /*yield*/, this.conRep.findAndCount(__assign(__assign({}, findOption), { order: { sorting: 'ASC' } }))];
                    case 4:
                        _b = _c.sent(), cts = _b[0], count = _b[1];
                        consList = cts.splice(start, end);
                        return [2 /*return*/, {
                                list: consList,
                                count: count
                            }];
                }
            });
        });
    };
    Db.prototype.putContentData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var exts, entity, content, conExt_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exts = Object.keys(data).filter(function (key) {
                            if (key.includes('ext_')) {
                                return true;
                            }
                        });
                        exts = exts.map(function (k) {
                            var v = {
                                key: k,
                                value: data[k]
                            };
                            delete data[k];
                            return v;
                        });
                        entity = this.conRep.create(data);
                        return [4 /*yield*/, this.conRep.save(entity)];
                    case 1:
                        content = _a.sent();
                        if (!exts.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.conExtRep.findOne({
                                where: {
                                    contentid: content.id
                                }
                            })];
                    case 2:
                        conExt_1 = _a.sent();
                        exts.forEach(function (v) {
                            conExt_1[v.key] = v.value;
                        });
                        return [4 /*yield*/, this.conExtRep.save(conExt_1)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Db.prototype.addMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.msgRep.create(data)];
                    case 1:
                        entity = _a.sent();
                        return [4 /*yield*/, this.msgRep.save(entity)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Db;
}());
exports.Db = Db;
