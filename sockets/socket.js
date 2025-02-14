// Exporteer een functie die een nieuwe Socket.IO-server maakt en luistert naar inkomende verbindingen
const { Server } = require('socket.io');

// Exporteer een functie die een nieuwe Socket.IO-server maakt en luistert naar inkomende verbindingen
module.exports = (server) => {
    // Maak een nieuwe Socket.IO-server
    const io = new Server(server);
    io.on('connection', (socket) => {
        // console log om te zien of de gebruiker verbonden is
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
            // Bepaal de roomnaam op basis van de ID's van de verzender en ontvanger zodat de berichten privé blijven tussen die twee gebruikers
            const roomName = `room_${Math.min(userId, receiverId)}_${Math.max(userId, receiverId)}`;
            console.log(`Gebruiker met ID ${userId} heeft zich aangesloten bij room ${roomName}`);
            socket.join(roomName);
        });

        // Luister naar privéberichten
        socket.on('privateMessage', (data) => {
            // Bepaal de roomnaam op basis van de ID's van de verzender en ontvanger zodat de berichten privé blijven tussen die twee gebruikers
            const roomName = `room_${Math.min(data.sender_id, data.receiver_id)}_${Math.max(data.sender_id, data.receiver_id)}`;
            // console log de berichten die worden ontvangen en verzonden
            console.log(`Bericht ontvangen van: ${data.sender_id} en verzenden naar room: ${roomName}`);
            // versturen van het privébericht naar de juiste room
            io.to(roomName).emit('privateMessage', {
                // versturen van de data van de verzender en het bericht
                sender: data.sender,
                // versturen van het bericht zelf
                message: data.message,
                // versturen van de media-url indien aanwezig
                media_url: data.media_url || null,
                // versuren van het tijdstip van het bericht
                timestamp: new Date().toLocaleTimeString()
            });
        });         
    });

    return io;
};
