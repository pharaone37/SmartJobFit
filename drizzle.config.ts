import { defineConfig } from "drizzle-kit";

// Use SQLite for local development if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || "sqlite:local.db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: databaseUrl.startsWith("sqlite") ? "sqlite" : "postgresql",
  dbCredentials: databaseUrl.startsWith("sqlite") 
    ? { url: databaseUrl }
    : { url: databaseUrl },
});
