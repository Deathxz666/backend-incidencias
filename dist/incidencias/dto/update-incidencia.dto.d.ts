export declare class UpdateIncidenciaDto {
    titulo?: string;
    descripcion?: string;
    clasificacion?: 'incidencia' | 'accidente';
    tipo_mantenimiento?: 'correctivo' | 'preventivo';
    descripcion_solucion?: string;
}
