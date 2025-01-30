const pool = require('../db');

exports.findUserByUsername = async (username) => {
    const [rows] = await pool.promise().query('SELECT * FROM `users` WHERE username = ?', [username]);
    return rows[0];  // Geeft de eerste gevonden gebruiker terug
};      // Zoek gebruiker op gebruikersnaam                                         

exports.createUser = async (username, hashedPassword) => {
    return await pool.promise().query(
        'INSERT INTO `users` (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
    );
};
