
import { FastifyInstance } from 'fastify';
import { contentController } from '../controllers/contentController.js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const contentRoutes = (
  db: PostgresJsDatabase
) => async (fastify: FastifyInstance) => {
  const schema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' }, // Assuming ID is a number (serial in DB)
      },
      required: ['id'],
    },
  };

  fastify.get('/api/content/:id', { schema }, contentController(db));
};
