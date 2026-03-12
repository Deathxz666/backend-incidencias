import { Role } from '../roles/role.entity';
export declare class User {
    id_usuario: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    puesto: string;
    password: string;
    hashPassword(): Promise<void>;
    role: Role;
    fecha_creacion: Date;
}
