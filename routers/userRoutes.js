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

module.exports = router;
