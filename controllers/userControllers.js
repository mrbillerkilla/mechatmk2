const bcrypt = require('bcrypt');
const { findUserByUsername } = require('../models/userModel');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).send('Gebruiker bestaat niet.');
        }

        // Wachtwoord valideren
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Ongeldig wachtwoord.');
        }

        // Sla gegevens op in de sessie
        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/home');
    } catch (err) {
        console.error('Fout bij inloggen:', err);
        res.status(500).send('Er ging iets fout bij het inloggen.');
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
