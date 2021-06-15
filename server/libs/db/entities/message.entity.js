"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MessageEntity = void 0;
var typeorm_1 = require("typeorm");
var abstract_entity_1 = require("./abstract-entity");
var MessageEntity = /** @class */ (function (_super) {
    __extends(MessageEntity, _super);
    function MessageEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "acode");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "contacts");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "mobile");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "content");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "user_ip");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "user_os");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "user_bs");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "recontent");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "status");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "name");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "email");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "phone");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "fax");
    __decorate([
        typeorm_1.Column({ "default": '' })
    ], MessageEntity.prototype, "message");
    MessageEntity = __decorate([
        typeorm_1.Entity('ay_message')
    ], MessageEntity);
    return MessageEntity;
}(abstract_entity_1.AbstractEntity));
exports.MessageEntity = MessageEntity;
