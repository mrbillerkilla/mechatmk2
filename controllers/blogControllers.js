// models importeren voor de blogs 
const { insertBlog, 
        fetchBlogs } = require('../models/blogModel');

// Maak een nieuwe blog aan
exports.createBlog = async (req, res) => {
    try {
        // console.log ontvangen data van client
        console.log('Ontvangen data van de client:', req.body);
        // Variables voor de blog in de body van het request
        const { title, content, author } = req.body;
        // check of de titel is ingevuld en de auhtor ook bekend is op basis van user_ID
        if (!author) {
            console.error('Geen author ontvangen!');
            return res.status(400).send('Author ontbreekt.');
        };
        // checken of de titel is ingevuld
        if (!title) {
            console.error('Geen titel ontvangen!');
            return res.status(400).send('Titel ontbreekt.');
        };
        // Roep de functie in het model aan om de blog op te slaan
        await insertBlog(title, content, author);
        console.log('Blog succesvol opgeslagen.');
        // Wanneer dat voltouid is, stuur een redirect naar de blogs.html pagina
        res.redirect('/blogs.html');
    } catch (err) {
        console.error('Fout bij het opslaan van de blog:', err);
        res.status(500).send('Er ging iets mis bij het opslaan.');
    }
};

// Haal alle blogs op 
exports.getBlogs = async (req, res) => {
    try {
        // Roep de functie in het model aan om de blogs op te halen
        const blogs = await fetchBlogs();
        // Stuur de blogs terug naar de client
        res.json(blogs);
    } catch (err) {
        console.error('Fout bij ophalen van blogs:', err);
        res.status(500).json({ error: 'Fout bij het ophalen van blogs.' });
    }
};
