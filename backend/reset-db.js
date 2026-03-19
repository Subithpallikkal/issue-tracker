const { Client } = require('pg');
require('dotenv').config();

async function resetDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database. Dropping tables...');
    
    // Drop tables with CASCADE to remove foreign key constraints
    await client.query('DROP TABLE IF EXISTS discussions CASCADE;');
    await client.query('DROP TABLE IF EXISTS issues CASCADE;');
    await client.query('DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;');
    
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await client.end();
  }
}

resetDb();
