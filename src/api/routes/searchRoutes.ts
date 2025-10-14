
import { FastifyInstance } from 'fastify';
import { searchController } from '../controllers/searchController.js';

export const searchRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/api/search', searchController);
};
