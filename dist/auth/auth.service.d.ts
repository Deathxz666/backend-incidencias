import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
export declare class AuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id_usuario: string;
            nombres: string;
            apellido_paterno: string;
            apellido_materno: string;
            puesto: string;
            email: string;
            role: string;
            fecha_creacion: Date;
        };
    }>;
    getProfile(email: string): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        fecha_creacion: Date;
    }>;
    listUsers(requestRole: string, search?: string): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        fecha_creacion: Date;
    }[]>;
    updateUser(userId: string, dto: UpdateUserDto, requestRole: string): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        fecha_creacion: Date;
        message: string;
    }>;
}
