
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Redis } from 'ioredis';

export const healthRoute = (db: PostgresJsDatabase, redis: Redis) => async (fastify: FastifyInstance) => {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dbStatus = await db.execute('SELECT 1').then(() => 'connected').catch(() => 'disconnected');
      const redisStatus = await redis.ping().then(() => 'connected').catch(() => 'disconnected');

      if (dbStatus === 'connected' && redisStatus === 'connected') {
        reply.code(200).send({ status: 'OK', database: dbStatus, redis: redisStatus });
      } else {
        reply.code(503).send({ status: 'ERROR', database: dbStatus, redis: redisStatus });
      }
    } catch (error) {
      fastify.log.error(error);
      reply.code(503).send({ status: 'ERROR', database: 'disconnected', redis: 'disconnected' });
    }
  });
};
