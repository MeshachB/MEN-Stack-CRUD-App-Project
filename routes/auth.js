const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('auth/register');
});
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error creating user');
  }
});

module.exports = router;
