import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';

@Entity('usuarios')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column()
  nombres: string;

  @Column()
  apellido_paterno: string;

  @Column()
  apellido_materno: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  puesto: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      return;
    }

    this.password = await bcrypt.hash(this.password, 10);
  }

  @ManyToOne(() => Role, (role) => role.usuarios)
  @JoinColumn({ name: 'id_rol' })
  role: Role;

  @CreateDateColumn()
  fecha_creacion: Date;
}
