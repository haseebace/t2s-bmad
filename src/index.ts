import * as dotenv from 'dotenv';
import { createDbClient } from './db/index.js';
import { createServer } from './app.js';
import { createRedisClient } from './config/redis.js';

dotenv.config();

const db = createDbClient(process.env.DATABASE_URL!);
const redis = createRedisClient(process.env.REDIS_URL!);
const server = createServer(db, redis);

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
