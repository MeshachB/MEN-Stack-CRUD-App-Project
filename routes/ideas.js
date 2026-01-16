console.log('ideas routes file loaded');

const express = require('express');
const router = express.Router();

const Idea = require('../models/Idea');

router.get('/', async (req, res) => {
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




module.exports = router;
