const { Server } = require('socket.io');
const pool = require('../db');  // Databaseconnectie

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nieuwe gebruiker verbonden:', socket.id);

        // Gebruiker join een groep
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`Gebruiker met ID ${socket.id} joined group ${groupId}`);
        });

        // Luister naar nieuwe groepsberichten
        socket.on('groupMessage', async (data) => {
            const { group_id, sender_id, message } = data;

            // Sla het bericht op in de database
            await pool.promise().query(
                'INSERT INTO group_messages (group_id, sender_id, message) VALUES (?, ?, ?)',
                [group_id, sender_id, message]
            );

            // Stuur het bericht naar alle leden van de groep
            io.to(group_id).emit('groupMessage', {
                sender_id,
                message,
                timestamp: new Date().toISOString()
            });
        });
    });

    return io;
};
