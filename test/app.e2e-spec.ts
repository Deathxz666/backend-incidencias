import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e-lite)', () => {
  let app: INestApplication;

  const authServiceMock = {
    register: jest.fn().mockResolvedValue({
      id_usuario: '1',
      email: 'new@demo.com',
      role: 'user',
      message: 'Usuario registrado correctamente',
    }),
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        nombres: 'Ana',
        apellido_paterno: 'Perez',
        apellido_materno: 'Lopez',
        email: 'new@demo.com',
        password: '123456',
      })
      .expect(201);
  });
});
