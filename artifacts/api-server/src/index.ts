import app from "./app";
import { logger } from "./lib/logger";

logger.info({ dbUrl: process.env.DATABASE_URL }, "STARTUP DATABASE_URL VALUE");

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Diagnostics test query
  const { db, usersTable } = require("@workspace/db");
  db.select().from(usersTable).then((res: any) => {
    logger.info({ count: res.length }, "TEST DB SELECT USERS SUCCESS");
  }).catch((err: any) => {
    logger.error({ err }, "TEST DB SELECT USERS FAILED");
  });
});
