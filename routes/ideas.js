console.log('ideas routes file loaded');

const express = require('express');
const router = express.Router();
const User = require('../models/User');

const multer = require('multer');
const path = require('path');

// Multer config
   
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



// Auth middleware

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Index 
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    res.render('ideas/index', { ideas: user.ideas });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// New 
router.get('/new', isLoggedIn, (req, res) => {
  res.render('ideas/new');
});

// CREATE 

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user);

    user.ideas.push({
      title: req.body.title,
      description: req.body.description,
      image: ''
    });

    await user.save();
    res.redirect('/ideas');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Show logic 

router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const idea = user.ideas.id(req.params.id);

    if (!idea) return res.status(404).send('Idea not found');
    res.render('ideas/show', { idea });
  } catch (err) {
    console.error(err);
    res.status(404).send('Invalid ID');
  }
});

//Edit logic

router.get('/:id/edit', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user);
  const idea = user.ideas.id(req.params.id);
  res.render('ideas/edit', { idea });
});

// update 

router.put('/:id', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user);
  const idea = user.ideas.id(req.params.id);

  idea.title = req.body.title;
  idea.description = req.body.description;

  await user.save();
  res.redirect('/ideas');
});

// upload route logic 
router.post('/:id/image', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const idea = user.ideas.id(req.params.id);

    idea.image = req.file.filename;
    await user.save();

    res.redirect(`/ideas/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Image upload failed');
  }
});

//delete
router.delete('/:id', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user);
  user.ideas.id(req.params.id).remove();
  await user.save();

  res.redirect('/ideas');
});

module.exports = router;