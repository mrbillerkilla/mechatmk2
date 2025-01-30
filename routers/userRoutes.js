const express = require('express');
const router = express.Router();
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

module.exports = router;  
