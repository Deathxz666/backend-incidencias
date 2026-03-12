export declare class QueryIncidenciasDto {
    page?: number;
    limit?: number;
    search?: string;
    estado?: string;
    clasificacion?: 'incidencia' | 'accidente';
    tipo_mantenimiento?: 'correctivo' | 'preventivo';
    from?: string;
    to?: string;
    sortBy?: 'fecha_creacion' | 'fecha_actualizacion' | 'titulo' | 'clasificacion' | 'tipo_mantenimiento';
    sortOrder?: 'ASC' | 'DESC';
}
