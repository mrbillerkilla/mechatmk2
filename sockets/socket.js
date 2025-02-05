const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nieuwe gebruiker verbonden:', socket.id);

        // Luister naar nieuwe groepschatberichten met media
        socket.on('chatMessage', (data) => {
            console.log('Nieuw bericht ontvangen:', data);

            // Broadcast het bericht naar iedereen, inclusief media-URL indien aanwezig
            io.emit('chatMessage', {
                sender: data.sender,
                message: data.message,
                media_url: data.media_url || null,
                timestamp: new Date().toLocaleTimeString()
            });
        });

        // Wanneer een gebruiker een privéchat opent, verbind met de juiste room
        socket.on('joinPrivateChat', (userId, receiverId) => {
            const roomName = `room_${Math.min(userId, receiverId)}_${Math.max(userId, receiverId)}`;
            console.log(`Gebruiker met ID ${userId} heeft zich aangesloten bij room ${roomName}`);
            socket.join(roomName);
        });

        // Luister naar privéberichten
        socket.on('privateMessage', (data) => {
            const roomName = `room_${Math.min(data.sender_id, data.receiver_id)}_${Math.max(data.sender_id, data.receiver_id)}`;
            console.log(`Bericht ontvangen van: ${data.sender_id} en verzenden naar room: ${roomName}`);
            
            io.to(roomName).emit('privateMessage', {
                sender: data.sender,
                message: data.message,
                media_url: data.media_url || null,
                timestamp: new Date().toLocaleTimeString()
            });
        });         
    });

    return io;
};
