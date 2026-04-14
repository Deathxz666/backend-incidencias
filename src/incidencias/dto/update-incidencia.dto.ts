import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIncidenciaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['incidencia', 'accidente'])
  clasificacion?: 'incidencia' | 'accidente';

  @IsOptional()
  @IsString()
  @IsIn(['correctivo', 'preventivo'])
  tipo_mantenimiento?: 'correctivo' | 'preventivo';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcion_solucion?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  asignado_a?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tiempo_solucion?: string;
}
