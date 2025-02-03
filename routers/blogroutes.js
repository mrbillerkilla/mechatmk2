const express = require('express');
const router = express.Router();
const db = require('../db'); // Zorg dat je database-verbinding hier correct staat


router.post('/createBlog', (req, res) => {
    console.log('Ontvangen data van de client:');
    console.log(req.body);  // Laat zien wat er binnenkomt

    const { title, content, author } = req.body;

    if (!author) {
        console.error('Geen author ontvangen!');
        return res.status(400).send('Author ontbreekt.');
    }

    const query = 'INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)';
    db.query(query, [title, content, author], (err) => {
        if (err) {
            console.error('Databasefout:', err);
            return res.status(500).send('Er ging iets mis bij het opslaan.');
        }
        console.log('Blog succesvol opgeslagen.');
        res.redirect('/blogs.html');
    });
});



router.get('/api/blogs', (req, res) => {
    const query = 'SELECT * FROM blogs ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Fout bij het ophalen van blogs.' });
        }
        res.json(results);
    });
});

module.exports = router;
