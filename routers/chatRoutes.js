const express = require('express');
// Multer importeren voor de bestandsuploads
const multer = require('multer');
const router = express.Router();
// Importeer de functies uit de controllers
const { saveGroupMessage, 
        getGroups, 
        getGroupMessages, 
        getPrivateMessages, 
        savePrivateMessage, 
        createGroup} = require('../controllers/chatControllers');

// Routes
router.post('/saveMessage', saveGroupMessage);
router.get('/groups', getGroups);
router.get('/messages/:group_id', getGroupMessages);
router.get('/private-messages/:sender_id/:receiver_id', getPrivateMessages);
router.post('/savePrivateMessage', savePrivateMessage);
router.post('/createGroups', createGroup);

// Multer-configuratie voor uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');  // Bestanden opslaan in de 'uploads'-map
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Geef bestanden unieke namen
    }
});
// Multer initialiseren met de storage-configuratie
const upload = multer({ storage: storage });

// Upload route
router.post('/upload', upload.single('media'), (req, res) => {
    // Als er geen bestand is geüpload, geef een foutmelding
    if (!req.file) {
        // Fout melding
        return res.status(400).send('Geen bestand geüpload.');
    }
    // besands-url samenstellen zodat het weer wordt opgehaald in de frontend omdat ze nu verkrijgbaar zijn via de url
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    // Stuur de URL terug naar de client
    res.json({ url: fileUrl });
});

// alle routers exporteren voor gebruik in de pagina's
module.exports = router;
