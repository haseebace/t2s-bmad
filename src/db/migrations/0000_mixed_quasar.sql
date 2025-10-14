CREATE TYPE "public"."status" AS ENUM('PENDING', 'PROCESSING', 'AVAILABLE', 'FAILED');--> statement-breakpoint
CREATE TABLE "content" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer,
	"magnet_link" text,
	"status" "status" DEFAULT 'PENDING',
	"streaming_url" text,
	"file_name" text,
	"file_size_bytes" bigint,
	"torrent_info_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"error_message" text,
	CONSTRAINT "content_tmdb_id_unique" UNIQUE("tmdb_id")
);
