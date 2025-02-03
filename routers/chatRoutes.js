const express = require('express');
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

module.exports = router;
