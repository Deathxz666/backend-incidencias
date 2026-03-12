import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { Estado } from '../estados/estado.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Estado)
    private estadoRepository: Repository<Estado>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedEstados();
  }

  private async seedRoles() {
    const roles = ['admin', 'user'];

    for (const nombre_rol of roles) {
      const exists = await this.roleRepository.findOne({ where: { nombre_rol } });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create({ nombre_rol }));
      }
    }
  }

  private async seedEstados() {
    const estados = [
      { nombre_estado: 'pendiente', color: '#F59E0B' },
      { nombre_estado: 'en_progreso', color: '#3B82F6' },
      { nombre_estado: 'resuelta', color: '#10B981' },
    ];

    for (const estadoData of estados) {
      const exists = await this.estadoRepository.findOne({
        where: { nombre_estado: estadoData.nombre_estado },
      });
      if (!exists) {
        await this.estadoRepository.save(
          this.estadoRepository.create(estadoData),
        );
      } else if (exists.color !== estadoData.color) {
        exists.color = estadoData.color;
        await this.estadoRepository.save(exists);
      }
    }
  }
}

