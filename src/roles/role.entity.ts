import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('roles')
export class Role {

  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({ unique: true })
  nombre_rol: string;

  @OneToMany(() => User, (user) => user.role)
  usuarios: User[];
}
