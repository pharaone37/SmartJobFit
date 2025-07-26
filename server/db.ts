import { drizzle } from 'drizzle-orm/d1';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import Database from 'better-sqlite3';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Use SQLite for local development if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || "sqlite:local.db";

let db: any;

if (databaseUrl.startsWith("sqlite")) {
  // SQLite for local development
  const sqlite = new Database("local.db");
  db = drizzleSQLite(sqlite, { schema });
} else {
  // PostgreSQL for production
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set for production. Did you forget to provision a database?",
    );
  }

  // Configure pool with proper connection settings
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  db = drizzleNeon({ client: pool, schema });
}

export { db };