import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IncidenciasService } from './incidencias.service';
import { Incidencia } from './incidencia.entity';
import { Estado } from '../estados/estado.entity';
import { User } from '../users/user.entity';

describe('IncidenciasService', () => {
  let service: IncidenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidenciasService,
        { provide: getRepositoryToken(Incidencia), useValue: {} },
        { provide: getRepositoryToken(Estado), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<IncidenciasService>(IncidenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
