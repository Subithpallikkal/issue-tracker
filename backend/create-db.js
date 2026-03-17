const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Subith@123@localhost:5432/postgres'
  });

  try {
    await client.connect();
    // Using underscore to avoid naming issues with hyphens
    await client.query('CREATE DATABASE issue_tracker;');
    console.log('Successfully created database: issue_tracker');
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
