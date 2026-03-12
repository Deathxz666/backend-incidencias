import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const role = await this.roleRepository.findOne({
      where: { nombre_rol: 'user' },
    });

    if (!role) {
      throw new ConflictException('Rol no válido');
    }

    const user = this.userRepository.create({
      nombres: registerDto.nombres,
      apellido_paterno: registerDto.apellido_paterno,
      apellido_materno: registerDto.apellido_materno,
      puesto: registerDto.puesto,
      email: registerDto.email,
      password: registerDto.password,
      role,
    });

    const saved = await this.userRepository.save(user);

    return {
      id_usuario: saved.id_usuario,
      nombres: saved.nombres,
      apellido_paterno: saved.apellido_paterno,
      apellido_materno: saved.apellido_materno,
      puesto: saved.puesto,
      email: saved.email,
      role: role.nombre_rol,
      message: 'Usuario registrado correctamente',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isHashedPasswordValid = await bcrypt.compare(password, user.password);

    if (!isHashedPasswordValid && user.password === password) {
      await this.userRepository.update(user.id_usuario, {
        password: await bcrypt.hash(password, 10),
      });
    } else if (!isHashedPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      email: user.email,
      role: user.role.nombre_rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: user.id_usuario,
        nombres: user.nombres,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        puesto: user.puesto,
        email: user.email,
        role: user.role.nombre_rol,
        fecha_creacion: user.fecha_creacion,
      },
    };
  }

  async getProfile(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id_usuario: user.id_usuario,
      nombres: user.nombres,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno,
      puesto: user.puesto,
      email: user.email,
      role: user.role?.nombre_rol,
      fecha_creacion: user.fecha_creacion,
    };
  }

  async listUsers(requestRole: string, search?: string) {
    if (requestRole !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede ver usuarios');
    }

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.fecha_creacion', 'DESC');

    if (search?.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(
        `(
          LOWER(user.email) LIKE :q OR
          LOWER(user.nombres) LIKE :q OR
          LOWER(user.apellido_paterno) LIKE :q OR
          LOWER(user.apellido_materno) LIKE :q
        )`,
        { q },
      );
    }

    const users = await qb.getMany();

    return users.map((user) => ({
      id_usuario: user.id_usuario,
      nombres: user.nombres,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno,
      puesto: user.puesto,
      email: user.email,
      role: user.role?.nombre_rol,
      fecha_creacion: user.fecha_creacion,
    }));
  }

  async updateUser(userId: string, dto: UpdateUserDto, requestRole: string) {
    if (requestRole !== 'admin') {
      throw new ForbiddenException('Solo el administrador puede actualizar usuarios');
    }

    const user = await this.userRepository.findOne({
      where: { id_usuario: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('El correo ya está registrado');
      }
      user.email = dto.email;
    }

    user.nombres = dto.nombres ?? user.nombres;
    user.apellido_paterno = dto.apellido_paterno ?? user.apellido_paterno;
    user.apellido_materno = dto.apellido_materno ?? user.apellido_materno;
    user.puesto = dto.puesto ?? user.puesto;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const saved = await this.userRepository.save(user);

    return {
      id_usuario: saved.id_usuario,
      nombres: saved.nombres,
      apellido_paterno: saved.apellido_paterno,
      apellido_materno: saved.apellido_materno,
      puesto: saved.puesto,
      email: saved.email,
      role: saved.role?.nombre_rol,
      fecha_creacion: saved.fecha_creacion,
      message: 'Usuario actualizado correctamente',
    };
  }
}
