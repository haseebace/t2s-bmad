
import { FastifyRequest, FastifyReply } from 'fastify';
import { searchJackett } from '../../lib/jackettService.js';

export const searchController = async (request: FastifyRequest, reply: FastifyReply) => {
  const { query } = request.query as { query: string };

  if (!query) {
    return reply.code(400).send({ error: 'Query parameter is required' });
  }

  try {
    const results = await searchJackett(
      process.env.JACKETT_API_URL!,
      process.env.JACKETT_API_KEY!,
      query
    );
    reply.send(results);
  } catch (error) {
    reply.code(502).send({ error: 'Failed to fetch search results.' });
  }
};
