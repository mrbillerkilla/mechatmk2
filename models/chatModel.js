const pool = require('../db');

// Voeg een groepsbericht toe
exports.insertGroupMessage = async (group_id, sender_id, message, created_at) => {
    const [result] = await pool.promise().query(
        'INSERT INTO group_messages (group_id, sender_id, message, created_at) VALUES (?, ?, ?, ?)',
        [group_id, sender_id, message, created_at]
    );
    return result;
};

// Haal alle groepen op
exports.fetchGroups = async () => {
    const [rows] = await pool.promise().query('SELECT * FROM `groups`');
    return rows;
};

// Haal groepsberichten op
exports.fetchGroupMessages = async (groupId) => {
    const [rows] = await pool.promise().query(
        'SELECT * FROM group_messages WHERE group_id = ? ORDER BY created_at ASC',
        [groupId]
    );
    return rows;
};

// Haal privéberichten op
exports.fetchPrivateMessages = async (sender_id, receiver_id) => {
    const [rows] = await pool.promise().query(
        `SELECT * FROM private_messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?) 
         ORDER BY created_at ASC`,
        [sender_id, receiver_id, receiver_id, sender_id]
    );
    return rows;
};

// Voeg een privébericht toe
exports.insertPrivateMessage = async (sender_id, receiver_id, message) => {
    const [result] = await pool.promise().query(
        'INSERT INTO private_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [sender_id, receiver_id, message]
    );
    return result;
};

// Voeg een nieuwe groep toe
exports.insertGroup = async (group_name) => {
    const [result] = await pool.promise().query(
        'INSERT INTO `groups` (group_name) VALUES (?)',
        [group_name]
    );
    return result;
};
