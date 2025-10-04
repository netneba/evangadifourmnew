const mysql2 = require("mysql2");

// Create a connection pool
const dbconnect = mysql2.createPool({
  host: "localhost",
  user: "evangadiadmin",
  password: "123456",
  database: "evangadi_db",
  connectionLimit: 10,
});

// Export promise-based pool
module.exports = dbconnect.promise();
