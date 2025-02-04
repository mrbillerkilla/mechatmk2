const express = require('express');
const session = require('express-session');
const http = require('http');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routers/userRoutes');
const initializeSockets = require('./sockets/socket');
const chatRoutes = require('./routers/chatRoutes');
const blogRoutes = require('./routers/blogroutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Multer configuratie
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(chatRoutes);
app.use(userRoutes);
app.use(blogRoutes);

// Upload route
app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Geen bestand geüpload.');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Maak uploads-map toegankelijk
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve de login- en registratiepagina's
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});


app.use(express.static(path.join(__dirname, 'view')));


// Initialiseer de Socket.IO-setup
initializeSockets(server);


// Start de server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
