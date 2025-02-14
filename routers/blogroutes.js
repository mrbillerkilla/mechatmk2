const express = require('express');
// Router voor de blog
const router = express.Router();
// Importeer de functies uit de controllers
const { createBlog, 
        getBlogs } = require('../controllers/blogControllers');

// Route voor het maken van een blog
router.post('/createBlog', createBlog);

// Route om blogs op te halen
router.get('/api/blogs', getBlogs);

module.exports = router;
