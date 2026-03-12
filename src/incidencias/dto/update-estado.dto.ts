import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEstadoDto {
  @IsString()
  @IsIn(['pendiente', 'en_progreso', 'resuelta'])
  estado: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descripcion_solucion?: string;
}
