import * as dotenv from 'dotenv';
import { createRedisClient } from '../config/redis.js';
import { startJobConsumer, Job } from './consumers/jobConsumer.js';
import { processTorrent } from './processors/torrentProcessor.js';
import { createDbClient } from '../db/index.js';

dotenv.config();

// Global error handler for non-critical shutdown errors from webtorrent
process.on('uncaughtException', (err: any) => {
  if (err.code === 'UTP_ECONNRESET') {
    console.log('Caught and ignored non-critical UTP_ECONNRESET error.');
  } else {
    // For all other errors, log and exit as normal
    console.error('Uncaught Exception:', err);
    process.exit(1);
  }
});

const redis = createRedisClient(process.env.REDIS_URL!);
const db = createDbClient(process.env.DATABASE_URL!);
const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME!;
const apiKey = process.env.BUNNY_STORAGE_API_KEY!;
const streamHostname = process.env.BUNNY_STREAM_HOSTNAME!;
const tokenSecurityKey = process.env.BUNNY_TOKEN_SECURITY_KEY!;

const main = async () => {
  console.log('Worker process started.');

  const jobProcessor = async (job: Job) => {
    await processTorrent(db, job.id, job.magnetLink, storageZoneName, apiKey, streamHostname, tokenSecurityKey);
  };

  await startJobConsumer(redis, jobProcessor);
};

main().catch((err: any) => {
  console.error('Worker process failed:', err);
  process.exit(1);
});