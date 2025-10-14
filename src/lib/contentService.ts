
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { content, statusEnum } from '../db/schema';

export const findContentByTmdbId = async (
  db: PostgresJsDatabase,
  tmdbId: number
) => {
  try {
    const result = await db.select().from(content).where(eq(content.tmdbId, tmdbId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding content by TMDb ID:', error);
    throw new Error('Could not query database.');
  }
};

export const findContentById = async (
  db: PostgresJsDatabase,
  id: number
) => {
  try {
    const result = await db.select().from(content).where(eq(content.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding content by ID:', error);
    throw new Error('Could not query database.');
  }
};

export const createContent = async (
  db: PostgresJsDatabase,
  data: { tmdbId: number; magnetLink: string }
) => {
  const result = await db.insert(content).values(data).returning();
  return result[0];
};

export const updateContent = async (
  db: PostgresJsDatabase,
  id: number,
  data: Partial<typeof content.$inferInsert>
) => {
  const result = await db
    .update(content)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(content.id, id))
    .returning();
  return result[0];
};
