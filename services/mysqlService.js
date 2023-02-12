const mysql = require('mysql');

const db_config = {
  user: process.env.DB_CONFIG_USER,
  password: process.env.DB_CONFIG_PASSWORD,
  database: process.env.DB_CONFIG_DATABASE,
  host: process.env.DB_CONFIG_HOST,
  port: process.env.DB_CONFIG_PORT,
};
const pool = mysql.createPool(db_config);

/**
 * CREATE PROMISE QUERY INSTEAD OF CALLBACK
 **/
const query = function (sql, params) {
  const queryPromise = new Promise((resolve, reject) => {
    pool.getConnection((connectionError, connection) => {
      if (connectionError) reject(connectionError);
      else {
        connection.query(sql, params, (queryError, queryResult) => {
          if (queryError) reject(queryError);
          resolve(queryResult);
          connection.release();
        });
      }
    });
  });
  return queryPromise;
};

module.exports = {
  query,
  pool,
};
