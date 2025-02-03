const { insertBlog, fetchBlogs } = require('../models/blogModel');

// Maak een nieuwe blog aan
exports.createBlog = async (req, res) => {
    try {
        console.log('Ontvangen data van de client:', req.body);
        const { title, content, author } = req.body;

        if (!author) {
            console.error('Geen author ontvangen!');
            return res.status(400).send('Author ontbreekt.');
        }

        // Roep de functie in het model aan om de blog op te slaan
        await insertBlog(title, content, author);
        console.log('Blog succesvol opgeslagen.');
        res.redirect('/blogs.html');
    } catch (err) {
        console.error('Fout bij het opslaan van de blog:', err);
        res.status(500).send('Er ging iets mis bij het opslaan.');
    }
};

// Haal alle blogs op
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await fetchBlogs();
        res.json(blogs);
    } catch (err) {
        console.error('Fout bij ophalen van blogs:', err);
        res.status(500).json({ error: 'Fout bij het ophalen van blogs.' });
    }
};
