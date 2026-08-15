const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_F6MBhkq1Dleo@ep-dark-mountain-axhhz2x2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in database:", res.rows.map(r => r.table_name));
  } catch (err) {
    console.error("List tables failed:", err);
  } finally {
    await client.end();
  }
}
main();
