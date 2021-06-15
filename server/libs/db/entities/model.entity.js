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
exports.ModelEntity = void 0;
var typeorm_1 = require("typeorm");
var abstract_entity_1 = require("./abstract-entity");
var ModelEntity = /** @class */ (function (_super) {
    __extends(ModelEntity, _super);
    function ModelEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // mcode必须有唯一值
    ModelEntity.prototype.index = function () {
        this.mcode = Math.random().toString();
    };
    ModelEntity.prototype.setMcode = function () {
        this.mcode = this.id.toString();
    };
    __decorate([
        typeorm_1.Column()
    ], ModelEntity.prototype, "mcode");
    __decorate([
        typeorm_1.Column()
    ], ModelEntity.prototype, "name");
    __decorate([
        typeorm_1.Column()
    ], ModelEntity.prototype, "type");
    __decorate([
        typeorm_1.Column()
    ], ModelEntity.prototype, "listtpl");
    __decorate([
        typeorm_1.Column()
    ], ModelEntity.prototype, "contenttpl");
    __decorate([
        typeorm_1.Column({ "default": '1' })
    ], ModelEntity.prototype, "status");
    __decorate([
        typeorm_1.Column({ "default": '0' })
    ], ModelEntity.prototype, "issystem");
    __decorate([
        typeorm_1.BeforeInsert()
    ], ModelEntity.prototype, "index");
    __decorate([
        typeorm_1.AfterInsert()
    ], ModelEntity.prototype, "setMcode");
    ModelEntity = __decorate([
        typeorm_1.Entity('ay_model')
    ], ModelEntity);
    return ModelEntity;
}(abstract_entity_1.AbstractEntity));
exports.ModelEntity = ModelEntity;
