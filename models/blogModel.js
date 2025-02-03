const pool = require('../db');

// Voeg een blog toe aan de database
exports.insertBlog = async (title, content, author) => {
    const query = 'INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)';
    await pool.promise().query(query, [title, content, author]);
};

// Haal alle blogs op uit de database
exports.fetchBlogs = async () => {
    const query = 'SELECT * FROM blogs ORDER BY created_at DESC';
    const [rows] = await pool.promise().query(query);
    return rows;
};
