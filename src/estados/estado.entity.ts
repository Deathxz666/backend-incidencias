import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Incidencia } from '../incidencias/incidencia.entity';

@Entity('estados')
export class Estado {

  @PrimaryGeneratedColumn('uuid')
  id_estado: string;

  @Column({ unique: true })
  nombre_estado: string;

  @Column({ length: 7, default: '#6B7280' })
  color: string;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.estado)
  incidencias: Incidencia[];
}
