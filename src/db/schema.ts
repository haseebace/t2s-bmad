
import { pgTable, serial, text, integer, timestamp, pgEnum, bigint } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['PENDING', 'PROCESSING', 'AVAILABLE', 'FAILED']);

export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  tmdbId: integer('tmdb_id').unique(),
  magnetLink: text('magnet_link'),
  status: statusEnum('status').default('PENDING'),
  streamingUrl: text('streaming_url'),
  fileName: text('file_name'),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),
  torrentInfoHash: text('torrent_info_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  errorMessage: text('error_message'),
});
