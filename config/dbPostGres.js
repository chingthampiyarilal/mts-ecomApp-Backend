const { Pool } = require('pg');

const pool = new Pool({
  user: 'my_user',
  host: 'localhost',
  database: 'my_database',
  password: 'root',
  port: 5432, 
});

module.exports = pool;
