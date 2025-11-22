import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to Neon Postgres database');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database table verified/created');

    await client.query(`CREATE INDEX IF NOT EXISTS idx_code ON links(code);`);
    console.log('Database index verified/created');
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

export { pool, initDB };
