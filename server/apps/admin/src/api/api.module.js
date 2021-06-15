"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ApiModule = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var api_controller_1 = require("./api.controller");
var api_service_1 = require("./api.service");
var jwt_1 = require("@nestjs/jwt");
var constants_1 = require("../auth/constants");
var jwt_strategy_1 = require("../auth/jwt.strategy");
var platform_express_1 = require("@nestjs/platform-express");
var multerConfig_service_1 = require("./multerConfig.service");
var ApiModule = /** @class */ (function () {
    function ApiModule() {
    }
    ApiModule = __decorate([
        common_1.Module({
            imports: [
                passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
                jwt_1.JwtModule.register({
                    secret: constants_1.jwtConstants.secret,
                    signOptions: { expiresIn: 36000 }
                }),
                platform_express_1.MulterModule.registerAsync({
                    useClass: multerConfig_service_1.MulterConfigService
                })
            ],
            controllers: [api_controller_1.ApiController],
            providers: [api_service_1.ApiService, jwt_strategy_1.JwtStrategy]
        })
    ], ApiModule);
    return ApiModule;
}());
exports.ApiModule = ApiModule;
