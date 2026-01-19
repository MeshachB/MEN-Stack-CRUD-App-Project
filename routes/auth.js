const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword
    });

    res.redirect('/login');
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).send('Error creating user');
  }
});

/* SHOW LOGIN */
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid credentials');
    }

    req.session.userId = user._id;
    res.redirect('/ideas');
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).send('Login failed');
  }
});


module.exports = router;
