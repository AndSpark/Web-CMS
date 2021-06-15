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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var dbs_1 = require("../../../../libs/db/dbs");
var bcrypt = require("bcryptjs");
var AuthService = /** @class */ (function () {
    function AuthService(jwtService) {
        this.jwtService = jwtService;
    }
    AuthService.prototype.validateUser = function (credentials, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, db, user, isValid, payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = credentials.username, password = credentials.password;
                        return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.getUser(username)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException();
                        }
                        return [4 /*yield*/, user.comparePassword(password)];
                    case 3:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw new common_1.UnauthorizedException();
                        }
                        payload = { username: user.username };
                        token = 'bearer ' + this.jwtService.sign(payload);
                        return [2 /*return*/, { token: token }];
                }
            });
        });
    };
    AuthService.prototype.getUser = function (jwt, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var username, db, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = this.jwtService.decode(jwt.replace('bearer ', '')).username;
                        return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.getUser(username)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException();
                        }
                        return [2 /*return*/, user.toObj()];
                }
            });
        });
    };
    AuthService.prototype.updateUser = function (updateForm, sitetplpath) {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, originPassword, db, user, isValid, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = updateForm.username, password = updateForm.password, originPassword = updateForm.originPassword;
                        return [4 /*yield*/, dbs_1.dbs.createDb(sitetplpath)];
                    case 1:
                        db = _b.sent();
                        return [4 /*yield*/, db.getUser(username)];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('用户名或原密码错误');
                        }
                        return [4 /*yield*/, user.comparePassword(originPassword)];
                    case 3:
                        isValid = _b.sent();
                        if (!isValid) {
                            throw new common_1.UnauthorizedException('用户名或原密码错误');
                        }
                        _a = user;
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 4:
                        _a.password = _b.sent();
                        return [4 /*yield*/, db.userRep.save(user)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, 'success'];
                }
            });
        });
    };
    AuthService = __decorate([
        common_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;