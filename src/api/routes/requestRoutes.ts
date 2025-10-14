
import { FastifyInstance } from 'fastify';
import { requestController } from '../controllers/requestController.js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Redis } from 'ioredis';

export const requestRoutes = (
  db: PostgresJsDatabase,
  redis: Redis
) => async (fastify: FastifyInstance) => {
  const schema = {
    body: {
      type: 'object',
      required: ['magnetLink', 'tmdbId'],
      properties: {
        magnetLink: { type: 'string' },
        tmdbId: { type: 'number' },
      },
    },
  };

  fastify.post('/api/request', { schema }, requestController(db, redis));
};
