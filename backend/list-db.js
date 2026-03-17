const { Client } = require('pg');

async function listDatabases() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Subith@123@localhost:5432/postgres'
  });

  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
    console.log('Available databases:');
    res.rows.forEach(row => console.log(` - ${row.datname}`));
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } finally {
    await client.end();
  }
}

listDatabases();
