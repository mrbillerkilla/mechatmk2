// Importeer de functies uit de models
const { insertGroupMessage, 
        fetchGroups, 
        fetchGroupMessages, 
        fetchPrivateMessages, 
        insertPrivateMessage, 
        insertGroup} = require('../models/chatModel');

// Sla een groepsbericht op
exports.saveGroupMessage = async (req, res) => {
    // Variabelen voor het groepsbericht uit de body van het request
    const { group_id, sender_id, message, media_url } = req.body;
    // Datum en tijd van het bericht vastleggen en de juiste notatie geven voor de database zodat helemaal correct wordt opgeslagen.
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Roep de functie in het model aan om het bericht op te slaan
        const result = await insertGroupMessage(group_id, sender_id, message, media_url, created_at);
        // Als het bericht is opgeslagen, stuur een succesvolle status terug. Als er minder dan 1 rij is beïnvloed, stuurt hij een foutmelding.
        if (result.affectedRows > 0) {
            res.status(200).send('Bericht succesvol opgeslagen');
        } else {
            res.status(500).send('Fout bij opslaan in de database.');
        }
    } catch (err) {
        // als er een fout optreedt, stuur een foutmelding en log de fout in de console
        console.error('SQL-fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een SQL-fout opgetreden.');
    }
};

// Sla een privébericht op
exports.savePrivateMessage = async (req, res) => {
    // Variabelen voor het privébericht uit de body van het request
    const { sender_id, receiver_id, message, media_url } = req.body;
    try {
        // Roep de functie in het model aan om het bericht op te slaan 
        const result = await insertPrivateMessage(sender_id, receiver_id, message, media_url);
        // Als er meer dan 1 rij is beïnvloed, stuur een succesvolle status terug. Als er minder dan 1 rij is beïnvloed, stuurt hij een foutmelding.
        if (result.affectedRows > 0) {
            res.status(200).send('Bericht opgeslagen');
        } else {
            res.status(500).send('Fout bij opslaan in de database');
        }
    } catch (err) {
        console.error('Fout bij opslaan van bericht:', err);
        res.status(500).send('Er is een fout opgetreden');
    }
};


// Haal alle groepen op
exports.getGroups = async (req, res) => {
    try {
        const groups = await fetchGroups();
        res.status(200).json(groups);
    } catch (err) {
        console.error('Fout bij ophalen van groepen:', err);
        res.status(500).send('Kan de groepen niet ophalen.');
    }
};

// Haal berichten op voor een specifieke groep
exports.getGroupMessages = async (req, res) => {
    const groupId = req.params.group_id;

    try {
        const messages = await fetchGroupMessages(groupId);
        res.json(messages);
    } catch (err) {
        console.error('Fout bij ophalen van berichten:', err);
        res.status(500).send('Fout bij ophalen van berichten');
    }
};

// Haal privéberichten op tussen twee gebruikers
exports.getPrivateMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.params;

    try {
        const messages = await fetchPrivateMessages(sender_id, receiver_id);
        res.json(messages);
    } catch (err) {
        console.error('Fout bij ophalen van privéberichten:', err);
        res.status(500).send('Fout bij ophalen van privéberichten');
    }
};


// Maak een nieuwe groep aan
exports.createGroup = async (req, res) => {
    const { group_name } = req.body;

    if (!group_name) {
        return res.status(400).send('Group name is vereist.');
    }

    try {
        const result = await insertGroup(group_name);
        res.status(201).json({ group_id: result.insertId, message: 'Groep succesvol aangemaakt!' });
    } catch (err) {
        console.error('Fout bij aanmaken van groep:', err);
        res.status(500).send('Er is een fout opgetreden bij het aanmaken van de groep.');
    }
};
