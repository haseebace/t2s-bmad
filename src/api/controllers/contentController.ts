
import { FastifyRequest, FastifyReply } from 'fastify';
import { findContentById } from '../../lib/contentService.js';
import { generateSecureStreamingUrl } from '../../lib/bunnyCdnService.js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const contentController = (
  db: PostgresJsDatabase
) => async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const contentRecord = await findContentById(db, parseInt(id, 10));

    if (!contentRecord) {
      return reply.code(404).send({ error: 'Content not found' });
    }

    const response: any = {
      id: contentRecord.id,
      tmdbId: contentRecord.tmdbId,
      status: contentRecord.status,
    };

    if (contentRecord.status === 'AVAILABLE' && contentRecord.fileName) {
      response.streamingUrl = generateSecureStreamingUrl(
        process.env.BUNNY_STREAM_HOSTNAME!,
        process.env.BUNNY_TOKEN_SECURITY_KEY!,
        contentRecord.fileName
      );
    }

    reply.send(response);
  } catch (error) {
    console.error('Error retrieving content:', error);
    reply.code(500).send({ error: 'An unexpected error occurred.' });
  }
};
