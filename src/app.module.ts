import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Estado } from './estados/estado.entity';
import { Incidencia } from './incidencias/incidencia.entity';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username:
        process.env.DB_USERNAME || process.env.DB_USER || 'incidencias_user',
      password: process.env.DB_PASSWORD || 'Incidencias2025!',
      database: process.env.DB_NAME || 'incidencias_db',
      entities: [User, Role, Estado, Incidencia],
      synchronize: (process.env.DB_SYNC || 'true') === 'true',
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Role, Estado]),
    AuthModule,
    IncidenciasModule,
  ],
  providers: [SeedService],
})
export class AppModule {}

