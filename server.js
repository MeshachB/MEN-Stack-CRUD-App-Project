require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

const ideaRoutes = require('./routes/ideas');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ROUTES
app.use('/', authRoutes);
app.use('/ideas', ideaRoutes);

// ROOT ENTRY (IMPORTANT FOR HEROKU)
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/ideas');
  } else {
    res.redirect('/login');
  }
});

// DB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB (Atlas)');
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
