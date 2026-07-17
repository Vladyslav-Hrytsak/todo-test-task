import request from 'supertest';
import app from '@/app';
import { prisma } from '@/config/prisma';
import '@/../tests/setup';

describe('Task routes (integration)', () => {
  describe('POST /api/tasks', () => {
    it('creates a task with valid data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Buy groceries', priority: 7 });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ title: 'Buy groceries', priority: 7, done: false });
    });

    it('rejects priority outside 1-10 range', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Invalid priority', priority: 15 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('rejects missing title', async () => {
      const res = await request(app).post('/api/tasks').send({ priority: 5 });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Low priority task', priority: 2, done: false },
          { title: 'High priority task', priority: 9, done: true },
          { title: 'Medium priority task', priority: 5, done: false },
        ],
      });
    });

    it('returns all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('filters by status=done', async () => {
      const res = await request(app).get('/api/tasks?status=done');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('High priority task');
    });

    it('filters by status=undone', async () => {
      const res = await request(app).get('/api/tasks?status=undone');
      expect(res.body).toHaveLength(2);
    });

    it('sorts by priority ascending', async () => {
      const res = await request(app).get('/api/tasks?sortBy=priority&sortOrder=asc');
      const priorities = res.body.map((t: { priority: number }) => t.priority);
      expect(priorities).toEqual([2, 5, 9]);
    });

    it('sorts by priority descending', async () => {
      const res = await request(app).get('/api/tasks?sortBy=priority&sortOrder=desc');
      const priorities = res.body.map((t: { priority: number }) => t.priority);
      expect(priorities).toEqual([9, 5, 2]);
    });

    it('searches by title (case-insensitive)', async () => {
      const res = await request(app).get('/api/tasks?search=HIGH');
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('High priority task');
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    it('toggles done status', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Toggle me' });
      const taskId = created.body.id;

      const toggled = await request(app).patch(`/api/tasks/${taskId}/toggle`);
      expect(toggled.body.done).toBe(true);

      const toggledAgain = await request(app).patch(`/api/tasks/${taskId}/toggle`);
      expect(toggledAgain.body.done).toBe(false);
    });

    it('returns 404 for non-existent task', async () => {
      const res = await request(app).patch('/api/tasks/nonexistent-id/toggle');
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes an existing task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
      const taskId = created.body.id;

      const res = await request(app).delete(`/api/tasks/${taskId}`);
      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });
  });
});