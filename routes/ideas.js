console.log('ideas routes file loaded');

const express = require('express');
const router = express.Router();

const Idea = require('../models/Idea');

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

router.get('/new', (req, res) => {
  res.render('ideas/new');
});

router.post('/', async (req, res) => {
  try {
    await Idea.create(req.body);
    res.redirect('/ideas');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.redirect('/ideas');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.render('ideas/edit', { idea });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.put('/:id', async (req, res) => {
  try {
    await Idea.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/ideas');
  } catch (err) {
    res.status(500).send(err.message);
  }
});




module.exports = router;
