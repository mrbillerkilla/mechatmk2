const bcrypt = require('bcrypt');
const { findUserByUsername, createUser } = require('../models/userModel');

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
        res.redirect('/home');  // Verwijs naar de juiste route
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

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
