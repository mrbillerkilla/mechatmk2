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

        // Luister naar privéberichten
        socket.on('privateMessage', (data) => {
            const roomName = `room_${Math.min(data.sender_id, data.receiver_id)}_${Math.max(data.sender_id, data.receiver_id)}`;
            console.log(`Bericht ontvangen van: ${data.sender_id} en verzenden naar room: ${roomName}`);

            // Verstuur het bericht naar alle gebruikers in de room, inclusief media-URL indien aanwezig
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
