import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellido_paterno: string;

  @IsString()
  @IsNotEmpty()
  apellido_materno: string;

  @IsString()
  @IsNotEmpty()
  puesto: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
