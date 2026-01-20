console.log('ideas routes file loaded');

const express = require('express');
const router = express.Router();

const Idea = require('../models/Idea');
const multer = require('multer');
const path = require('path');

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


function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}



router.get('/', isLoggedIn, async (req, res) => {
  try {
    const ideas = await Idea.find({});
    res.render('ideas/index', { ideas });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// SHOW ALL IDEAS
router.get('/', async (req, res) => {
  const ideas = await Idea.find();
  res.render('ideas/index', { ideas });
});

// SHOW ONE IDEA (THIS MUST COME FIRST)
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.render('ideas/show', { idea });
  } catch (err) {
    res.status(404).send('Idea not found');
  }
});

// UPLOAD IMAGE FOR IDEA (SHOW PAGE ONLY)
router.post('/:id/image', upload.single('image'), async (req, res) => {
  try {
    await Idea.findByIdAndUpdate(req.params.id, {
      image: req.file.filename,
    });

    res.redirect(`/ideas/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Image upload failed');
  }
});



// EDIT PAGE
router.get('/:id/edit', async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  res.render('ideas/edit', { idea });
});

// UPDATE
router.put('/:id', async (req, res) => {
  await Idea.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/ideas');
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);
  res.redirect('/ideas');
});



module.exports = router;
