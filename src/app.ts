
import fastify, { FastifyInstance } from 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { healthRoute } from './api/routes/health.js';
import { searchRoutes } from './api/routes/searchRoutes.js';
import { requestRoutes } from './api/routes/requestRoutes.js';
import { contentRoutes } from './api/routes/contentRoutes.js';
import { Redis } from 'ioredis';

export const createServer = (db: PostgresJsDatabase, redis: Redis): FastifyInstance => {
  const server = fastify({ logger: true });
  server.register(healthRoute(db, redis));
  server.register(searchRoutes);
  server.register(requestRoutes(db, redis));
  server.register(contentRoutes(db));
  return server;
};


