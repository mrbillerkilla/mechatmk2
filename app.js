const express = require('express');
const session = require('express-session');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routers/userRoutes');

dotenv.config(); // Zorg dat dotenv bovenaan staat

const app = express();
const server = http.createServer(app);

// Middleware voor sessies
const sessionMiddleware = session({
    secret: 'mama',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000 // 1 uur
    }
});

app.use(sessionMiddleware);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve de loginpagina
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Gebruik de router voor gebruikersfunctionaliteiten
app.use(userRoutes);

// Start de server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});