"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./users/user.entity");
const role_entity_1 = require("./roles/role.entity");
const estado_entity_1 = require("./estados/estado.entity");
const incidencia_entity_1 = require("./incidencias/incidencia.entity");
const incidencias_module_1 = require("./incidencias/incidencias.module");
const seed_service_1 = require("./seed/seed.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 5432),
                username: process.env.DB_USERNAME || process.env.DB_USER || 'incidencias_user',
                password: process.env.DB_PASSWORD || 'Incidencias2025!',
                database: process.env.DB_NAME || 'incidencias_db',
                entities: [user_entity_1.User, role_entity_1.Role, estado_entity_1.Estado, incidencia_entity_1.Incidencia],
                synchronize: (process.env.DB_SYNC || 'true') === 'true',
                autoLoadEntities: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role, estado_entity_1.Estado]),
            auth_module_1.AuthModule,
            incidencias_module_1.IncidenciasModule,
        ],
        providers: [seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map