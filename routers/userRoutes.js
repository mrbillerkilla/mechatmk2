const express = require('express');
const router = express.Router();
const { loginUser, showHomePage, logoutUser } = require('../controllers/userControllers');

// Route voor loginpagina
router.post('/login', loginUser);

// Route voor de homepage
router.get('/home', showHomePage);

// Route voor uitloggen
router.get('/logout', logoutUser);

module.exports = router;
