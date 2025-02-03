const express = require('express');
const router = express.Router();
const pool = require('../db');  // Database connectie
const { loginUser, registerUser, showHomePage, logoutUser, getUserInfo, updateColor, deleteUser, getUsers } = require('../controllers/userControllers');

// Login route
router.post('/login', loginUser);

// Registratie route
router.post('/register', registerUser);

// Homepage route
router.get('/home', showHomePage);

// Logout route
router.get('/logout', logoutUser);


router.get('/user-info', (req, res) => {
    const userId = req.session.userId;  // Neem aan dat je sessies gebruikt om de ingelogde gebruiker te tracken

    if (!userId) {
        return res.status(401).send('Niet ingelogd');
    }

    const query = 'SELECT username, profile_color FROM users WHERE id = ?';
    pool.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Fout bij ophalen van gebruikersinfo:', err);
            return res.status(500).send('Er ging iets mis.');
        }

        if (results.length > 0) {
            res.json({
                username: results[0].username,
                profileColor: results[0].profile_color,
                userId: userId
            });
        } else {
            res.status(404).send('Gebruiker niet gevonden.');
        }
    });
});

router.post('/updateColor', (req, res) => {
    const { userId, profileColor } = req.body;

    const query = 'UPDATE users SET profile_color = ? WHERE id = ?';
    pool.query(query, [profileColor, userId], (err) => {
        if (err) {
            console.error('Fout bij updaten profielkleur:', err);
            return res.status(500).send('Er ging iets mis.');
        }
        res.send('Profielkleur bijgewerkt.');
    });
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

router.post('/deleteUser', async (req, res) => {
    const { userId } = req.body;

    try {
        // Haal de gebruikersnaam op
        const [userResult] = await pool.promise().query('SELECT username FROM users WHERE id = ?', [userId]);
        
        if (userResult.length === 0) {
            return res.status(404).send('Gebruiker niet gevonden.');
        }

        const username = userResult[0].username;

        // Verwijder privéberichten
        await pool.promise().query('DELETE FROM private_messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);

        // Verwijder groepsleden
        await pool.promise().query('DELETE FROM group_members WHERE user_id = ?', [userId]);

        // Verwijder groepsberichten
        await pool.promise().query('DELETE FROM group_messages WHERE sender_id = ?', [userId]);

        // Verwijder blogs van deze gebruiker
        await pool.promise().query('DELETE FROM blogs WHERE author = ?', [username]);

        // Verwijder gebruiker zelf
        await pool.promise().query('DELETE FROM users WHERE id = ?', [userId]);

        res.send('Gebruiker en gerelateerde gegevens succesvol verwijderd.');
    } catch (err) {
        console.error('Fout bij verwijderen van gebruiker:', err);
        res.status(500).send('Er ging iets mis bij het verwijderen.');
    }
});



module.exports = router;  
