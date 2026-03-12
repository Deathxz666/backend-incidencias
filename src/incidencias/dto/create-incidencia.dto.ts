import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateIncidenciaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsIn(['incidencia', 'accidente'])
  clasificacion: 'incidencia' | 'accidente';

  @IsString()
  @IsIn(['correctivo', 'preventivo'])
  tipo_mantenimiento: 'correctivo' | 'preventivo';
}
