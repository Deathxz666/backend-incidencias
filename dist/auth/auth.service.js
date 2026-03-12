"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
let AuthService = class AuthService {
    userRepository;
    roleRepository;
    jwtService;
    constructor(userRepository, roleRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        const role = await this.roleRepository.findOne({
            where: { nombre_rol: 'user' },
        });
        if (!role) {
            throw new common_1.ConflictException('Rol no válido');
        }
        const user = this.userRepository.create({
            nombres: registerDto.nombres,
            apellido_paterno: registerDto.apellido_paterno,
            apellido_materno: registerDto.apellido_materno,
            puesto: registerDto.puesto,
            email: registerDto.email,
            password: registerDto.password,
            role,
        });
        const saved = await this.userRepository.save(user);
        return {
            id_usuario: saved.id_usuario,
            nombres: saved.nombres,
            apellido_paterno: saved.apellido_paterno,
            apellido_materno: saved.apellido_materno,
            puesto: saved.puesto,
            email: saved.email,
            role: role.nombre_rol,
            message: 'Usuario registrado correctamente',
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.email = :email', { email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isHashedPasswordValid = await bcrypt.compare(password, user.password);
        if (!isHashedPasswordValid && user.password === password) {
            await this.userRepository.update(user.id_usuario, {
                password: await bcrypt.hash(password, 10),
            });
        }
        else if (!isHashedPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = {
            email: user.email,
            role: user.role.nombre_rol,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id_usuario: user.id_usuario,
                nombres: user.nombres,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                puesto: user.puesto,
                email: user.email,
                role: user.role.nombre_rol,
                fecha_creacion: user.fecha_creacion,
            },
        };
    }
    async getProfile(email) {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        return {
            id_usuario: user.id_usuario,
            nombres: user.nombres,
            apellido_paterno: user.apellido_paterno,
            apellido_materno: user.apellido_materno,
            puesto: user.puesto,
            email: user.email,
            role: user.role?.nombre_rol,
            fecha_creacion: user.fecha_creacion,
        };
    }
    async listUsers(requestRole, search) {
        if (requestRole !== 'admin') {
            throw new common_1.ForbiddenException('Solo el administrador puede ver usuarios');
        }
        const qb = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .orderBy('user.fecha_creacion', 'DESC');
        if (search?.trim()) {
            const q = `%${search.trim().toLowerCase()}%`;
            qb.andWhere(`(
          LOWER(user.email) LIKE :q OR
          LOWER(user.nombres) LIKE :q OR
          LOWER(user.apellido_paterno) LIKE :q OR
          LOWER(user.apellido_materno) LIKE :q
        )`, { q });
        }
        const users = await qb.getMany();
        return users.map((user) => ({
            id_usuario: user.id_usuario,
            nombres: user.nombres,
            apellido_paterno: user.apellido_paterno,
            apellido_materno: user.apellido_materno,
            puesto: user.puesto,
            email: user.email,
            role: user.role?.nombre_rol,
            fecha_creacion: user.fecha_creacion,
        }));
    }
    async updateUser(userId, dto, requestRole) {
        if (requestRole !== 'admin') {
            throw new common_1.ForbiddenException('Solo el administrador puede actualizar usuarios');
        }
        const user = await this.userRepository.findOne({
            where: { id_usuario: userId },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this.userRepository.findOne({ where: { email: dto.email } });
            if (existing) {
                throw new common_1.ConflictException('El correo ya está registrado');
            }
            user.email = dto.email;
        }
        user.nombres = dto.nombres ?? user.nombres;
        user.apellido_paterno = dto.apellido_paterno ?? user.apellido_paterno;
        user.apellido_materno = dto.apellido_materno ?? user.apellido_materno;
        user.puesto = dto.puesto ?? user.puesto;
        if (dto.password) {
            user.password = await bcrypt.hash(dto.password, 10);
        }
        const saved = await this.userRepository.save(user);
        return {
            id_usuario: saved.id_usuario,
            nombres: saved.nombres,
            apellido_paterno: saved.apellido_paterno,
            apellido_materno: saved.apellido_materno,
            puesto: saved.puesto,
            email: saved.email,
            role: saved.role?.nombre_rol,
            fecha_creacion: saved.fecha_creacion,
            message: 'Usuario actualizado correctamente',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map