
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const createDbClient = (connectionString: string) => {
  const client = postgres(connectionString);
  return drizzle(client);
};
