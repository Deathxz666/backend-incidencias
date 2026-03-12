import { Repository } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { QueryIncidenciasDto } from './dto/query-incidencias.dto';
import { Estado } from '../estados/estado.entity';
import { User } from '../users/user.entity';
export declare class IncidenciasService {
    private incidenciaRepository;
    private estadoRepository;
    private userRepository;
    constructor(incidenciaRepository: Repository<Incidencia>, estadoRepository: Repository<Estado>, userRepository: Repository<User>);
    create(createDto: CreateIncidenciaDto, userEmail: string): Promise<Incidencia>;
    findAll(role: string, userEmail: string, query: QueryIncidenciasDto): Promise<{
        data: Incidencia[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSoluciones(role: string, userEmail: string, query: QueryIncidenciasDto): Promise<{
        data: Incidencia[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(idIncidencia: string, updateDto: UpdateIncidenciaDto, userEmail: string, role: string): Promise<Incidencia>;
    updateEstado(idIncidencia: string, updateEstadoDto: UpdateEstadoDto, userEmail: string, role: string): Promise<Incidencia>;
    remove(idIncidencia: string, role: string): Promise<{
        message: string;
    }>;
    getReportes(role: string, query: QueryIncidenciasDto, reportByEmail: string): Promise<{
        total: number;
        generado_por: {
            email: string;
            nombre: string;
        };
        responsable: {
            id_usuario: string;
            nombre_completo: string;
            email: string;
            puesto: string;
            rol: string;
        };
        rango: {
            from: string | null;
            to: string | null;
        };
        por_estado: Record<string, number>;
        estado_colores: Record<string, string>;
        por_usuario: Record<string, number>;
        por_clasificacion: Record<string, number>;
        por_tipo_mantenimiento: Record<string, number>;
        detalles: {
            id_incidencia: string;
            titulo: string;
            descripcion: string;
            clasificacion: import("./incidencia.entity").ClasificacionIncidencia;
            tipo_mantenimiento: import("./incidencia.entity").TipoMantenimiento;
            descripcion_solucion: string;
            usuario_nombre: string;
            usuario: string;
            estado: string;
            estado_color: string;
            fecha_creacion: string;
            fecha_actualizacion: string;
            updated_by: string;
        }[];
    }>;
    getReportesPdf(role: string, query: QueryIncidenciasDto, reportByEmail: string): Promise<Buffer<ArrayBufferLike>>;
    private buildReportData;
    private formatUserName;
    private ensureCanEdit;
    private getDateRange;
}
