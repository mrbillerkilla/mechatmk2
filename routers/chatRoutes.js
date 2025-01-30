const express = require('express');
const router = express.Router();
const pool = require('../db');  // Databaseconnectie

// POST-route voor het opslaan van berichten
router.post('/saveMessage', async (req, res) => {
    const { group_id, sender_id, message } = req.body;

    try {
        await pool.promise().query(
            'INSERT INTO group_messages (group_id, sender_id, message) VALUES (?, ?, ?)',
            [group_id, sender_id, message]
        );
        res.status(200).send('Bericht opgeslagen');
    } catch (err) {
        console.error('Fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een fout opgetreden');
    }
});

module.exports = router;
