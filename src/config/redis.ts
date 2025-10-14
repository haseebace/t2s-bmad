
import Redis from 'ioredis';

export const createRedisClient = (redisUrl: string) => {
  return new Redis(redisUrl);
};
