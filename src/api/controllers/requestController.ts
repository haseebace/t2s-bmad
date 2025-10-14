
import { FastifyRequest, FastifyReply } from 'fastify';
import { findContentByTmdbId, createContent } from '../../lib/contentService.js';
import { addJob } from '../../lib/queue.js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Redis } from 'ioredis';

type RequestBody = { magnetLink: string; tmdbId: number };

export const requestController = (
  db: PostgresJsDatabase,
  redis: Redis
) => async (request: FastifyRequest, reply: FastifyReply) => {
  const { magnetLink, tmdbId } = request.body as RequestBody;

  try {
    // 1. Deduplication Check
    const existingContent = await findContentByTmdbId(db, tmdbId);
    if (existingContent) {
      return reply.send(existingContent);
    }

    // 2. Create Content Record
    const newContent = await createContent(db, { tmdbId, magnetLink });

    // 3. Add Job to Queue
    await addJob(redis, { id: newContent.id, magnetLink });

    // 4. Return New Content Record
    reply.code(201).send(newContent);

  } catch (error) {
    console.error('Error processing content request:', error);
    reply.code(500).send({ error: 'An unexpected error occurred.' });
  }
};
