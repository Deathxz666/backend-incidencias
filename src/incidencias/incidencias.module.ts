import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './incidencia.entity';
import { Estado } from '../estados/estado.entity';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Incidencia, Estado, User])],
  controllers: [IncidenciasController],
  providers: [IncidenciasService, RolesGuard],
})
export class IncidenciasModule {}
