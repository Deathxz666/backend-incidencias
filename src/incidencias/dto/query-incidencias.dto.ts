import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryIncidenciasDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  estado?: string;

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
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsIn(['fecha_creacion', 'fecha_actualizacion', 'titulo', 'clasificacion', 'tipo_mantenimiento'])
  sortBy?:
    | 'fecha_creacion'
    | 'fecha_actualizacion'
    | 'titulo'
    | 'clasificacion'
    | 'tipo_mantenimiento' = 'fecha_creacion';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

