import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        fecha_creacion: Date;
    }>;
    listUsers(req: any, search?: string): Promise<{
        id_usuario: string;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        puesto: string;
        email: string;
        role: string;
        fecha_creacion: Date;
    }[]>;
    updateUser(id: string, dto: UpdateUserDto, req: any): Promise<{
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
    adminOnly(): {
        message: string;
    };
}
