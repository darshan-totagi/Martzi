const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_F6MBhkq1Dleo@ep-dark-mountain-axhhz2x2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    await client.connect();
    const res = await client.query("SELECT id, name, email, role, created_at FROM users");
    console.log("Users in Neon database:", res.rows);
  } catch (err) {
    console.error("Failed to query users:", err);
  } finally {
    await client.end();
  }
}
main();
