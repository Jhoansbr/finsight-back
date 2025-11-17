import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  it('should return 200 and success message', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
  });
});

