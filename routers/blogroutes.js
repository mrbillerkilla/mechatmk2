const express = require('express');
const router = express.Router();
const { createBlog, 
        getBlogs } = require('../controllers/blogControllers');

// Route voor het maken van een blog
router.post('/createBlog', createBlog);

// Route om blogs op te halen
router.get('/api/blogs', getBlogs);

module.exports = router;
