const pool = require('../db');

exports.findUserByUsername = async (username) => {
    const [rows] = await pool.promise().query('SELECT * FROM `users` WHERE username = ?', [username]);
    return rows[0];  // Geeft de eerste gevonden gebruiker terug
};      // Zoek gebruiker op gebruikersnaam                                         

// Voeg een nieuwe gebruiker toe aan de database
exports.createUser = async (username, hashedPassword) => {
    return await pool.promise().query(
        'INSERT INTO `users` (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
    );
};


// Haal een gebruiker op met userId
exports.getUserById = async (userId) => {
    const [results] = await pool.promise().query('SELECT username, profile_color FROM users WHERE id = ?', [userId]);
    return results[0] || null;
};

// Update de profielkleur van een gebruiker
exports.updateUserColor = async (userId, profileColor) => {
    await pool.promise().query('UPDATE users SET profile_color = ? WHERE id = ?', [profileColor, userId]);
};

// Verwijder de gebruiker en gerelateerde gegevens
exports.deleteUserData = async (userId) => {
    const [userResult] = await pool.promise().query('SELECT username FROM users WHERE id = ?', [userId]);
    // Als de gebruiker niet bestaat, gooi een foutmelding
    if (userResult.length === 0) {
        throw new Error('Gebruiker niet gevonden');
    }

    const username = userResult[0].username;
    // Verwijder alle gerelateerde gegevens van de gebruiker
    await pool.promise().query('DELETE FROM private_messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);
    await pool.promise().query('DELETE FROM group_members WHERE user_id = ?', [userId]);
    await pool.promise().query('DELETE FROM group_messages WHERE sender_id = ?', [userId]);
    await pool.promise().query('DELETE FROM blogs WHERE author = ?', [username]);
    await pool.promise().query('DELETE FROM users WHERE id = ?', [userId]);
};

// Haal alle gebruikers behalve de ingelogde gebruiker op
exports.getAllUsersExcept = async (currentUserId) => {
    const [users] = await pool.promise().query('SELECT id, username FROM users WHERE id != ?', [currentUserId]);
    return users;
};