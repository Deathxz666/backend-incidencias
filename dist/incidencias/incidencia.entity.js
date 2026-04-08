"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incidencia = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const estado_entity_1 = require("../estados/estado.entity");
let Incidencia = class Incidencia {
    id_incidencia;
    titulo;
    descripcion;
    clasificacion;
    tipo_mantenimiento;
    descripcion_solucion;
    asignado_a;
    tiempo_solucion;
    estado;
    usuario;
    created_by;
    updated_by;
    fecha_creacion;
    fecha_actualizacion;
};
exports.Incidencia = Incidencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Incidencia.prototype, "id_incidencia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Incidencia.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Incidencia.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'incidencia',
    }),
    __metadata("design:type", String)
], Incidencia.prototype, "clasificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'correctivo',
    }),
    __metadata("design:type", String)
], Incidencia.prototype, "tipo_mantenimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Incidencia.prototype, "descripcion_solucion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], Incidencia.prototype, "asignado_a", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, nullable: true }),
    __metadata("design:type", Object)
], Incidencia.prototype, "tiempo_solucion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estado_entity_1.Estado, (estado) => estado.incidencias),
    (0, typeorm_1.JoinColumn)({ name: 'id_estado' }),
    __metadata("design:type", estado_entity_1.Estado)
], Incidencia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", user_entity_1.User)
], Incidencia.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Incidencia.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Incidencia.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Incidencia.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Incidencia.prototype, "fecha_actualizacion", void 0);
exports.Incidencia = Incidencia = __decorate([
    (0, typeorm_1.Entity)('incidencias')
], Incidencia);
//# sourceMappingURL=incidencia.entity.js.map