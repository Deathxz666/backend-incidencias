import type { Response } from 'express';
import { IncidenciasService } from './incidencias.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { QueryIncidenciasDto } from './dto/query-incidencias.dto';
export declare class IncidenciasController {
    private readonly incidenciasService;
    constructor(incidenciasService: IncidenciasService);
    create(dto: CreateIncidenciaDto, req: any): Promise<import("./incidencia.entity").Incidencia>;
    findAll(req: any, query: QueryIncidenciasDto): Promise<{
        data: import("./incidencia.entity").Incidencia[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findSoluciones(req: any, query: QueryIncidenciasDto): Promise<{
        data: import("./incidencia.entity").Incidencia[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReportes(req: any, query: QueryIncidenciasDto): Promise<{
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
            asignado_a: string;
            tiempo_solucion: string;
            estado: string;
            estado_color: string;
            fecha_creacion: string;
            fecha_actualizacion: string;
            updated_by: string;
        }[];
    }>;
    getReportesPdf(req: any, query: QueryIncidenciasDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: string, dto: UpdateIncidenciaDto, req: any): Promise<import("./incidencia.entity").Incidencia>;
    updateEstado(id: string, dto: UpdateEstadoDto, req: any): Promise<import("./incidencia.entity").Incidencia>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
