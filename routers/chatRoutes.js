const express = require('express');
const multer = require('multer');
const path = require('path');


const router = express.Router();
const {
    saveGroupMessage,
    getGroups,
    getGroupMessages,
    getPrivateMessages,
    savePrivateMessage,
    createGroup
} = require('../controllers/chatControllers');

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

const upload = multer({ storage: storage });

// Upload route
router.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Geen bestand geüpload.');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

module.exports = router;
