import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

// Load .env from root, prioritizing workspace env over ambient container variables
try {
    const envPaths = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(__dirname, "../../../.env"),
      path.resolve(process.cwd(), "../../.env")
    ];
    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        for (const line of envContent.split("\n")) {
          const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?(.*?)["']?\s*$/);
          if (match) {
            process.env.DATABASE_URL = match[1];
            break;
          }
        }
        if (process.env.DATABASE_URL) break;
      }
    }
  } catch (e) {
    // Ignore
  }

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "drizzle-orm";
