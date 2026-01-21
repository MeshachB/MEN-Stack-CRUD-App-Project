console.log('ideas routes file loaded');

const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

const multer = require('multer');
const path = require('path');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Simple auth middleware
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Show new idea form
router.get('/new', isLoggedIn, (req, res) => {
  res.render('ideas/new');
});

// Create a new idea
router.post('/', isLoggedIn, async (req, res) => {
  try {
    await Idea.create(req.body);
    res.redirect('/ideas');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Show all ideas
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const ideas = await Idea.find({});
    res.render('ideas/index', { ideas });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Show edit form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  res.render('ideas/edit', { idea });
});

// Upload image for an idea
router.post('/:id/image', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    await Idea.findByIdAndUpdate(req.params.id, {
      image: req.file.filename
    });
    res.redirect(`/ideas/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Image upload failed');
  }
});

// Update an idea
router.put('/:id', isLoggedIn, async (req, res) => {
  await Idea.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/ideas');
});

// Delete an idea
router.delete('/:id', isLoggedIn, async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);
  res.redirect('/ideas');
});

// Show one idea (must be last)
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    res.render('ideas/show', { idea });
  } catch (err) {
    res.status(404).send('Invalid ID');
  }
});

module.exports = router;
