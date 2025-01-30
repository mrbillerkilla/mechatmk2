const express = require('express');
const session = require('express-session');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routers/userRoutes');
const initializeSockets = require('./sockets/socket');
const chatRoutes = require('./routers/chatRoutes');

dotenv.config();

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
        maxAge: 3600000
    }
});

app.use(sessionMiddleware);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(chatRoutes);

// Serve de login- en registratiepagina's
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
});


app.use(userRoutes);

// Initialiseer de Socket.IO-setup
initializeSockets(server);



// Start de server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
