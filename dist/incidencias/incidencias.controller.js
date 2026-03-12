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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidenciasController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const incidencias_service_1 = require("./incidencias.service");
const create_incidencia_dto_1 = require("./dto/create-incidencia.dto");
const update_incidencia_dto_1 = require("./dto/update-incidencia.dto");
const update_estado_dto_1 = require("./dto/update-estado.dto");
const query_incidencias_dto_1 = require("./dto/query-incidencias.dto");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let IncidenciasController = class IncidenciasController {
    incidenciasService;
    constructor(incidenciasService) {
        this.incidenciasService = incidenciasService;
    }
    create(dto, req) {
        return this.incidenciasService.create(dto, req.user.email);
    }
    findAll(req, query) {
        return this.incidenciasService.findAll(req.user.role, req.user.email, query);
    }
    findSoluciones(req, query) {
        return this.incidenciasService.getSoluciones(req.user.role, req.user.email, query);
    }
    getReportes(req, query) {
        return this.incidenciasService.getReportes(req.user.role, query, req.user.email);
    }
    async getReportesPdf(req, query, res) {
        const pdfBuffer = await this.incidenciasService.getReportesPdf(req.user.role, query, req.user.email);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=\"reporte-incidencias-${Date.now()}.pdf\"`);
        return res.send(pdfBuffer);
    }
    update(id, dto, req) {
        return this.incidenciasService.update(id, dto, req.user.email, req.user.role);
    }
    updateEstado(id, dto, req) {
        return this.incidenciasService.updateEstado(id, dto, req.user.email, req.user.role);
    }
    remove(id, req) {
        return this.incidenciasService.remove(id, req.user.role);
    }
};
exports.IncidenciasController = IncidenciasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incidencia_dto_1.CreateIncidenciaDto, Object]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_incidencias_dto_1.QueryIncidenciasDto]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('soluciones'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_incidencias_dto_1.QueryIncidenciasDto]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "findSoluciones", null);
__decorate([
    (0, common_1.Get)('reportes'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_incidencias_dto_1.QueryIncidenciasDto]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "getReportes", null);
__decorate([
    (0, common_1.Get)('reportes/pdf'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_incidencias_dto_1.QueryIncidenciasDto, Object]),
    __metadata("design:returntype", Promise)
], IncidenciasController.prototype, "getReportesPdf", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_incidencia_dto_1.UpdateIncidenciaDto, Object]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_estado_dto_1.UpdateEstadoDto, Object]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncidenciasController.prototype, "remove", null);
exports.IncidenciasController = IncidenciasController = __decorate([
    (0, common_1.Controller)('incidencias'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [incidencias_service_1.IncidenciasService])
], IncidenciasController);
//# sourceMappingURL=incidencias.controller.js.map