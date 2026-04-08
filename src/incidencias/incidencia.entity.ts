import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Estado } from '../estados/estado.entity';

export type ClasificacionIncidencia = 'incidencia' | 'accidente';
export type TipoMantenimiento = 'correctivo' | 'preventivo';

@Entity('incidencias')
export class Incidencia {
  @PrimaryGeneratedColumn('uuid')
  id_incidencia: string;

  @Column()
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'incidencia',
  })
  clasificacion: ClasificacionIncidencia;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'correctivo',
  })
  tipo_mantenimiento: TipoMantenimiento;

  @Column({ type: 'text', nullable: true })
  descripcion_solucion: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  asignado_a: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  tiempo_solucion: string | null;

  @ManyToOne(() => Estado, (estado) => estado.incidencias)
  @JoinColumn({ name: 'id_estado' })
  estado: Estado;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}

