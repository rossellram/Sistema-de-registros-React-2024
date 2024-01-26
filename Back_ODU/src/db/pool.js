// pool.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'ODU',
  host: 'localhost',
  database: 'Repost_ODU',
  password: 'ODU',
  port: 5432,
  schema: 'B_ODU', // Especifica el nombre de tu esquema aquí
});

module.exports = pool;
