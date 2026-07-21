const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Requerido para bases de datos en la nube como Neon
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
