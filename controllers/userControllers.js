const bcrypt = require('bcrypt');
const { findUserByUsername, 
        createUser, 
        getUserById, 
        deleteUserData, 
        updateUserColor, 
        getAllUsersExcept } = require('../models/userModel');


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).send('Gebruiker bestaat niet.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Ongeldig wachtwoord.');
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/home.html');  // Verwijs naar de juiste route
    } catch (err) {
        console.error('Fout bij inloggen:', err);
        res.status(500).send('Er ging iets fout bij het inloggen.');
    }
};


exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Controleer of de gebruikersnaam al bestaat
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).send('Gebruikersnaam bestaat al!');
        }

        // Wachtwoord versleutelen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Nieuwe gebruiker toevoegen aan database
        await createUser(username, hashedPassword);

        res.redirect('/');  // Terug naar de loginpagina
    } catch (err) {
        console.error('Fout bij registratie:', err);
        res.status(500).send('Er is een fout opgetreden.');
    }
};

exports.showHomePage = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');  // Terug naar loginpagina als niet ingelogd
    }
    res.send(`<h1>Welkom ${req.session.username}</h1><a href="/logout">Uitloggen</a>`);
};

// Haal de gebruikersinfo op
exports.getUserInfo = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send('Niet ingelogd');
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).send('Gebruiker niet gevonden.');
        }

        res.json({
            username: user.username,
            profileColor: user.profile_color,
            userId: userId
        });
    } catch (err) {
        console.error('Fout bij ophalen van gebruikersinfo:', err);
        res.status(500).send('Er ging iets mis.');
    }
};

// Update de profielkleur
exports.updateColor = async (req, res) => {
    const { userId, profileColor } = req.body;

    try {
        await updateUserColor(userId, profileColor);
        res.send('Profielkleur bijgewerkt.');
    } catch (err) {
        console.error('Fout bij updaten profielkleur:', err);
        res.status(500).send('Er ging iets mis.');
    }
};

// Verwijder een gebruiker
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await deleteUserData(userId);
        res.send('Gebruiker en gerelateerde gegevens succesvol verwijderd.');
    } catch (err) {
        console.error('Fout bij verwijderen van gebruiker:', err);
        res.status(500).send('Er ging iets mis.');
    }
};

// Haal alle gebruikers op behalve de ingelogde
exports.getUsers = async (req, res) => {
    try {
        const users = await getAllUsersExcept(req.session.userId);
        res.json(users);
    } catch (err) {
        console.error('Fout bij ophalen van gebruikers:', err);
        res.status(500).send('Er ging iets mis.');
    }
};
