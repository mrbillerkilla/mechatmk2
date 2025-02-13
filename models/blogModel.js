// Database connectie includeren 
const pool = require('../db');

// Voeg een blog toe aan de database
exports.insertBlog = async (title, content, author) => {
    const query = 'INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)';
    try {
        await pool.promise().query(query, [title, content, author]);
        console.log('Blog succesvol toegevoegd.');
    } catch (error) {
        console.error('Er is een fout opgetreden bij het toevoegen van de blog:', error.message);
        // Hier kun je aanvullende foutafhandelingslogica toevoegen, zoals het verzenden van een foutmelding naar de client
    }
};


// Haal alle blogs op uit de database
exports.fetchBlogs = async () => {
    const query = 'SELECT * FROM blogs ORDER BY created_at DESC';
    const [rows] = await pool.promise().query(query);
    return rows;
};
