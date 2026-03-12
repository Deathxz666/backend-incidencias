import { ForbiddenException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../src/auth/roles.guard';
import { IncidenciasController } from '../src/incidencias/incidencias.controller';
import { IncidenciasService } from '../src/incidencias/incidencias.service';

describe('Incidencias RBAC (e2e)', () => {
  let app: INestApplication;

  const roleRef = { current: 'user' };

  const incidenciasServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    updateEstado: jest.fn(),
    remove: jest.fn().mockResolvedValue({ message: 'Incidencia eliminada correctamente' }),
    getReportes: jest.fn().mockResolvedValue({ total: 0, por_estado: {}, por_usuario: {} }),
  };

  const jwtGuardToken = AuthGuard('jwt');

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IncidenciasController],
      providers: [
        {
          provide: IncidenciasService,
          useValue: incidenciasServiceMock,
        },
      ],
    })
      .overrideGuard(jwtGuardToken)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'user@demo.com', role: roleRef.current };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          if (req.user?.role !== 'admin') {
            throw new ForbiddenException('No tienes permisos para esta acción');
          }
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects delete for user role', async () => {
    roleRef.current = 'user';

    await request(app.getHttpServer())
      .delete('/incidencias/123')
      .expect(403);
  });

  it('allows delete for admin role', async () => {
    roleRef.current = 'admin';

    await request(app.getHttpServer())
      .delete('/incidencias/123')
      .expect(200);
  });

  it('rejects reportes for user role', async () => {
    roleRef.current = 'user';

    await request(app.getHttpServer())
      .get('/incidencias/reportes')
      .expect(403);
  });

  it('allows reportes for admin role', async () => {
    roleRef.current = 'admin';

    await request(app.getHttpServer())
      .get('/incidencias/reportes')
      .expect(200);
  });
});
