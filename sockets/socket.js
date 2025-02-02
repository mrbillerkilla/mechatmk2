const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nieuwe gebruiker verbonden:', socket.id);

        // Luister naar nieuwe berichten
        socket.on('chatMessage', (data) => {
            console.log('Nieuw bericht ontvangen:', data);

            // Broadcast het bericht naar iedereen
            io.emit('chatMessage', {
                sender: data.sender,
                message: data.message,
                timestamp: new Date().toLocaleTimeString()
            });
        });

        // Wanneer een gebruiker verbinding maakt, voeg hem toe aan zijn unieke room
        socket.on('joinPrivateChat', (userId, receiverId) => {
            const roomName = `room_${Math.min(userId, receiverId)}_${Math.max(userId, receiverId)}`;
            console.log(`Gebruiker met ID ${userId} heeft zich aangesloten bij room ${roomName}`);
            socket.join(roomName);
        });

        socket.on('privateMessage', (data) => {
            const roomName = `room_${Math.min(data.sender_id, data.receiver_id)}_${Math.max(data.sender_id, data.receiver_id)}`;
            console.log(`Bericht ontvangen van: ${data.sender_id} en verzenden naar room: ${roomName}`);
            
            // Verstuur het bericht naar alle gebruikers in de room
            io.to(roomName).emit('privateMessage', data);
        });      
    });

    return io;
};
