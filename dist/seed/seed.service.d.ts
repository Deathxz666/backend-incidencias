import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { Estado } from '../estados/estado.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private roleRepository;
    private estadoRepository;
    constructor(roleRepository: Repository<Role>, estadoRepository: Repository<Estado>);
    onApplicationBootstrap(): Promise<void>;
    private seedRoles;
    private seedEstados;
}
