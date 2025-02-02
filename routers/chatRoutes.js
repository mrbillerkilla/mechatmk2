const express = require('express');
const router = express.Router();
const pool = require('../db');  // Zorg voor een werkende databaseconnectie

router.post('/saveMessage', async (req, res) => {
    const { group_id, sender_id, message } = req.body;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        console.log('=== Ontvangen POST-data ===');
        console.log('Group ID:', group_id);
        console.log('Sender ID:', sender_id);
        console.log('Message:', message);
        console.log('Created At:', created_at);

        const query = 'INSERT INTO group_messages (group_id, sender_id, message, created_at) VALUES (?, ?, ?, ?)';
        console.log('=== Uit te voeren query ===');
        console.log(query);
        console.log('Met waarden:', [group_id, sender_id, message, created_at]);

        const [result] = await pool.promise().query(query, [group_id, sender_id, message, created_at]);

        console.log('=== Resultaat van INSERT ===');
        console.log(result);

        if (result.affectedRows > 0) {
            res.status(200).send('Bericht succesvol opgeslagen');
        } else {
            res.status(500).send('Fout bij opslaan in de database.');
        }
    } catch (err) {
        console.error('SQL-fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een SQL-fout opgetreden.');
    }
});

// API-route om groepen op te halen
router.get('/groups', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM `groups`');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Fout bij ophalen van groepen:', err);
        res.status(500).send('Kan de groepen niet ophalen.');
    }
});

// Haal alle berichten op voor een specifieke groep
router.get('/messages/:group_id', async (req, res) => {
    const groupId = req.params.group_id;

    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM group_messages WHERE group_id = ? ORDER BY created_at ASC',
            [groupId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Fout bij ophalen van berichten:', err);
        res.status(500).send('Fout bij ophalen van berichten');
    }
});

router.get('/private-messages/:sender_id/:receiver_id', async (req, res) => {
    const { sender_id, receiver_id } = req.params;

    try {
        const [rows] = await pool.promise().query(
            `SELECT * FROM private_messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?) 
             ORDER BY created_at ASC`,
            [sender_id, receiver_id, receiver_id, sender_id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Fout bij ophalen van privéberichten:', err);
        res.status(500).send('Fout bij ophalen van privéberichten');
    }
});

router.post('/savePrivateMessage', async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    try {
        const [result] = await pool.promise().query(
            `INSERT INTO private_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
            [sender_id, receiver_id, message]
        );

        if (result.affectedRows > 0) {
            res.status(200).send('Bericht opgeslagen');
        } else {
            res.status(500).send('Fout bij opslaan in de database');
        }
    } catch (err) {
        console.error('Fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een fout opgetreden');
    }
});
router.post('/createGroups', async (req, res) => {
    const { group_name } = req.body;

    if (!group_name) {
        return res.status(400).send('Group name is vereist.');
    }

    try {
        const [result] = await pool.promise().query(
            'INSERT INTO `groups` (group_name) VALUES (?)', // Backticks rond `groups`
            [group_name]
        );
        res.status(201).json({ group_id: result.insertId, message: 'Groep succesvol aangemaakt!' });
    } catch (err) {
        console.error('Fout bij aanmaken van groep:', err);
        res.status(500).send('Er is een fout opgetreden bij het aanmaken van de groep.');
    };
});

module.exports = router;
