import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

// Plain Node.js .env loader to ensure root env is loaded in workspace subpackages on Windows
try {
  const envPaths = [
    path.resolve(__dirname, "../../.env"),
    path.resolve(process.cwd(), ".env"),
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
  throw new Error("DATABASE_URL must be set in your root .env file.");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
