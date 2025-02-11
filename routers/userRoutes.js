const express = require('express');

const router = express.Router();

const { loginUser, 
        registerUser, 
        showHomePage, 
        getUserInfo, 
        updateColor, 
        deleteUser, 
        getUsers } = require('../controllers/userControllers');

// Login route
router.post('/login', loginUser);

// Registratie route
router.post('/register', registerUser);

// Homepage route
router.get('/home', showHomePage);

router.get('/user-info', getUserInfo);

// Update de profielkleur
router.post('/updateColor', updateColor);

// Verwijder een gebruiker
router.post('/deleteUser', deleteUser);

// Haal alle gebruikers op behalve de ingelogde
router.get('/users', getUsers);


module.exports = router;  
