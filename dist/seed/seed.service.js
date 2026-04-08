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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../roles/role.entity");
const estado_entity_1 = require("../estados/estado.entity");
let SeedService = class SeedService {
    roleRepository;
    estadoRepository;
    constructor(roleRepository, estadoRepository) {
        this.roleRepository = roleRepository;
        this.estadoRepository = estadoRepository;
    }
    async onApplicationBootstrap() {
        await this.seedRoles();
        await this.seedEstados();
    }
    async seedRoles() {
        const roles = ['admin', 'user'];
        for (const nombre_rol of roles) {
            const exists = await this.roleRepository.findOne({ where: { nombre_rol } });
            if (!exists) {
                await this.roleRepository.save(this.roleRepository.create({ nombre_rol }));
            }
        }
    }
    async seedEstados() {
        const estados = [
            { nombre_estado: 'pendiente', color: '#F59E0B' },
            { nombre_estado: 'en progreso', color: '#3B82F6' },
            { nombre_estado: 'resuelta', color: '#10B981' },
        ];
        const estadoLegacy = await this.estadoRepository.findOne({
            where: { nombre_estado: 'en_progreso' },
        });
        if (estadoLegacy) {
            estadoLegacy.nombre_estado = 'en progreso';
            estadoLegacy.color = '#3B82F6';
            await this.estadoRepository.save(estadoLegacy);
        }
        for (const estadoData of estados) {
            const exists = await this.estadoRepository.findOne({
                where: { nombre_estado: estadoData.nombre_estado },
            });
            if (!exists) {
                await this.estadoRepository.save(this.estadoRepository.create(estadoData));
            }
            else if (exists.color !== estadoData.color) {
                exists.color = estadoData.color;
                await this.estadoRepository.save(exists);
            }
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(estado_entity_1.Estado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map