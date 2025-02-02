const express = require('express');
const router = express.Router();
const pool = require('../db');  // Database connectie
const { loginUser, registerUser, showHomePage, logoutUser } = require('../controllers/userControllers');

// Login route
router.post('/login', loginUser);

// Registratie route
router.post('/register', registerUser);

// Homepage route
router.get('/home', showHomePage);

// Logout route
router.get('/logout', logoutUser);

router.get('/user-info', (req, res) => {
    if (req.session.userId && req.session.username) {
        res.json({ userId: req.session.userId, username: req.session.username });
    } else {
        res.status(401).send('Niet ingelogd');
    }
});

router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.promise().query(
            `SELECT id, username FROM users WHERE id != ?`,
            [req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Fout bij ophalen van gebruikers:', err);
        res.status(500).send('Fout bij ophalen van gebruikers');
    }
});


module.exports = router;  
