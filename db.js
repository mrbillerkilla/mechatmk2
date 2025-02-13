// dotenv config
require('dotenv').config();
// mysql2 importeren
const mysql = require('mysql2');
// pool connectie maken
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// exporteer pool zodat deze in andere bestanden gebruikt kan worden
module.exports = pool;

// Controleer databaseverbinding
pool.promise()
    .query('SELECT 1')
    .then(() => {
        console.log('Succesvol verbonden met de database!');
    })
    .catch((err) => {
        console.error('Databaseverbinding mislukt:', err.message);
    });
