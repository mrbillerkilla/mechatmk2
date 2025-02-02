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

        socket.on('privateMessage', (data) => {
            socket.to(data.receiver_id).emit('privateMessage', data);
        });
        
    });

    return io;
};
