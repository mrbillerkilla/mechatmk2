const express = require('express');
const router = express.Router();
const db = require('../db'); // Zorg dat je database-verbinding hier correct staat
const isAuthenticated = require('./middleware/isAuthenticated'); // Onze middleware

router.post('/createBlog', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    const author = req.session.user.username; // Neem de ingelogde gebruiker als auteur

    const query = 'INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)';
    db.query(query, [title, content, author], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Er ging iets mis.');
        }
        res.redirect('/blogs.html'); // Redirect naar de pagina met alle blogs
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
