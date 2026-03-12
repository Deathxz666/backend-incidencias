import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePuestoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  puesto: string;
}
