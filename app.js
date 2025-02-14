// Voor de opstart van de server en de configuratie van de middleware en routes van de applicatie.
const express = require('express');
// Voor de sessies die ik gebruik in de applicatie
const session = require('express-session');
// Voor het maken van een HTTP-server
const http = require('http');
// Voor het verwerken van de routes
const path = require('path');
// Voor het verwerken van bestanden die geüpload worden
const multer = require('multer');
// Voor het verwerken van de .env-folder
const dotenv = require('dotenv');
// Voor het verwerken van CORS om cross-origin requests toe te staan
const cors = require('cors');
// analyseert de body van een request en zet deze om naar een JSON-object
const bodyParser = require('body-parser');
// User routen definiëren
const userRoutes = require('./routers/userRoutes');
// Sockets initialiseren
const initializeSockets = require('./sockets/socket');
// Chat routes definiëren
const chatRoutes = require('./routers/chatRoutes');
// Blog routes definiëren
const blogRoutes = require('./routers/blogroutes');
// Laad de .env-bestanden in
dotenv.config();
// Maak een express-applicatie aan en een HTTP-server
const app = express();
const server = http.createServer(app);

// Multer configuratie voor het opslaan van bestanden
const storage = multer.diskStorage({
    // callback voor het opslaan van bestanden
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // callback voor het bepalen van de bestandsnaam
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer initialiseren met de storage-configuratie
const upload = multer({ storage: storage });

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

// Middleware voor body-parser
app.use(sessionMiddleware);
// Middleware voor CORS om cross requests toe te staan
app.use(cors());
// Middleware voor body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware voor body-parser om JSON-requests te verwerken
app.use(bodyParser.json());
// Router voor de chat
app.use(chatRoutes);
// Router voor de gebruikers
app.use(userRoutes);
// Router voor de blog
app.use(blogRoutes);

// POST-request voor het uploaden van bestanden
app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Geen bestand geüpload.');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Maak uploads-map toegankelijk om het vervolgens te kunnen gebruiken in de frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve de login- en registratiepagina's
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// files vanuit de map view beschikbaar maken
app.use(express.static(path.join(__dirname, 'view')));


// Sockets initialiseren
initializeSockets(server);


// Start de server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
