
import { Redis } from 'ioredis';
import { consumeJob } from '../../lib/queue.js';

export type Job = { id: number; magnetLink: string; [key: string]: any };
type JobProcessor = (job: Job) => Promise<void>;

export const startJobConsumer = async (redis: Redis, processJob: JobProcessor) => {
  console.log('Job consumer started. Waiting for jobs...');
  while (true) {
    try {
      const job = await consumeJob(redis);
      if (job) {
        console.log('Consumed job:', job);
        await processJob(job as Job);
      }
    } catch (error) {
      console.error('Error consuming or processing job:', error);
      // Add a small delay before retrying to prevent a tight loop on persistent errors
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
