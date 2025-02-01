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

+

module.exports = router;
