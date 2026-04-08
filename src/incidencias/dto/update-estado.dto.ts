import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEstadoDto {
  @IsString()
  @IsIn(['pendiente', 'en progreso', 'resuelta'])
  estado: string;

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
