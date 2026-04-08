import { User } from '../users/user.entity';
import { Estado } from '../estados/estado.entity';
export type ClasificacionIncidencia = 'incidencia' | 'accidente';
export type TipoMantenimiento = 'correctivo' | 'preventivo';
export declare class Incidencia {
    id_incidencia: string;
    titulo: string;
    descripcion: string;
    clasificacion: ClasificacionIncidencia;
    tipo_mantenimiento: TipoMantenimiento;
    descripcion_solucion: string | null;
    asignado_a: string | null;
    tiempo_solucion: string | null;
    estado: Estado;
    usuario: User;
    created_by: string;
    updated_by: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}
