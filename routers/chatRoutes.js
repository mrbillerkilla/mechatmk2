const express = require('express');
const router = express.Router();
const pool = require('../db');  // Databaseconnectie

// POST-route voor het opslaan van berichten
router.post('/saveMessage', async (req, res) => {
    const { group_id, sender_id, message } = req.body;
    const created_at = new Date();  // Haal de huidige tijd op

    try {
        console.log('Ontvangen data:', req.body);

        // Voeg created_at toe aan de query
        await pool.promise().query(
            'INSERT INTO `group_messages` (group_id, sender_id, message, created_at) VALUES (?, ?, ?, ?)',
            [group_id, sender_id, message, created_at]
        );

        console.log('Bericht succesvol opgeslagen.');
        res.status(200).send('Bericht opgeslagen');
    } catch (err) {
        console.error('Fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een fout opgetreden');
    }
});

module.exports = router;
