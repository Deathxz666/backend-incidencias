import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  apellido_materno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  puesto?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
