const express = require('express');
const router = express.Router();
// const pool = require('../db');  // Database connectie
const { loginUser, registerUser, showHomePage, getUserInfo, updateColor, deleteUser, getUsers } = require('../controllers/userControllers');

// Login route
router.post('/login', loginUser);

// Registratie route
router.post('/register', registerUser);

// Homepage route
router.get('/home', showHomePage);

// Logout route
// router.get('/logout', logoutUser);

router.get('/user-info', getUserInfo);
router.post('/updateColor', updateColor);
router.post('/deleteUser', deleteUser);
router.get('/users', getUsers);


module.exports = router;  
