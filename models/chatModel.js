const pool = require('../db');

// Voeg een groepsbericht toe aan de database
exports.insertGroupMessage = async (group_id, sender_id, message, media_url, created_at) => {
    // Voer een query uit om een nieuw groepsbericht toe te voegen
    const [result] = await pool.promise().query(
        // De query bevat placeholders (?) voor de variabelen die we willen invoegen
        'INSERT INTO group_messages (group_id, sender_id, message, created_at, media_url) VALUES (?, ?, ?, ?, ?)',
        [group_id, sender_id, message, created_at, media_url || null]
    );
    // Geef het resultaat van de query terug
    return result;
};


// Voeg een privébericht toe
exports.insertPrivateMessage = async (sender_id, receiver_id, message, media_url) => {
    // qeury uitvoeren in een array om het resultaat te verkrijgen
    const [result] = await pool.promise().query(
        'INSERT INTO private_messages (sender_id, receiver_id, message, media_url) VALUES (?, ?, ?, ?)',
        [sender_id, receiver_id, message, media_url || null]
    );
    // Resultaat terug vragen
    return result;
};


// Haal alle groepen op
exports.fetchGroups = async () => {
    // Qeury uitvoeren in een array om het resultaat te verkrijgen
    const [rows] = await pool.promise().query('SELECT * FROM `groups`');
    return rows;
};


// Haal groepsberichten op
exports.fetchGroupMessages = async (groupId) => {
    // Qeury uitvoeren in een array om het resultaat te verkrijgen
    const [rows] = await pool.promise().query(
        'SELECT * FROM group_messages WHERE group_id = ? ORDER BY created_at ASC',
        [groupId]
    );
    return rows;
};


// Haal privéberichten op
exports.fetchPrivateMessages = async (sender_id, receiver_id) => {
    // Qeury uitvoeren in een array om het resultaat te verkrijgen
    const [rows] = await pool.promise().query(
        `SELECT * FROM private_messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?) 
         ORDER BY created_at ASC`,
        [sender_id, receiver_id, receiver_id, sender_id]
    );
    return rows;
};



// Voeg een nieuwe groep toe
exports.insertGroup = async (group_name) => {
    // Qeury uitvoeren in een array om het resultaat te verkrijgen
    const [result] = await pool.promise().query(
        'INSERT INTO `groups` (group_name) VALUES (?)',
        [group_name]
    );
    return result;
};
