
import { Redis } from 'ioredis';

const QUEUE_NAME = 'content-queue';

export const addJob = async (redis: Redis, jobData: any) => {
  await redis.lpush(QUEUE_NAME, JSON.stringify(jobData));
};

export const consumeJob = async (redis: Redis) => {
  const result = await redis.brpop(QUEUE_NAME, 0);
  if (result) {
    return JSON.parse(result[1]);
  }
  return null;
};
