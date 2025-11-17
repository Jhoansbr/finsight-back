import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

const API_PREFIX = '/api/v1';

describe('Auth Endpoints', () => {
  let testUser = {
    email: 'test@midas.com',
    password: 'Test1234',
    nombre: 'Test',
    apellido: 'User',
  };

  afterAll(async () => {
    // Limpiar usuario de prueba
    await prisma.usuario.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/register`)
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should not register user with duplicate email', async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/register`)
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/register`)
        .send({
          email: 'invalid',
          password: '123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/login`)
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /auth/me', () => {
    let accessToken;

    beforeAll(async () => {
      const res = await request(app)
        .post(`${API_PREFIX}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      accessToken = res.body.data.accessToken;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get(`${API_PREFIX}/auth/me`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get(`${API_PREFIX}/auth/me`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get(`${API_PREFIX}/auth/me`)
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

