require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MovieDB';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// If the database is not connected, show a friendly error page instead of hanging.
app.use((req, res, next) => {
  if (req.path.startsWith('/css') || req.path.startsWith('/images')) return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).render('error', {
      title: 'Database unavailable',
      status: 503,
      message:
        'Could not connect to the MongoDB database. Make sure MongoDB is running and MONGODB_URI in your .env file is correct, then refresh this page.',
    });
  }
  next();
});

app.use('/', movieRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not found', status: 404, message: 'The page you are looking for does not exist.' });
});

// Central error handler (database query errors etc.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Request error:', err);
  res.status(500).render('error', {
    title: 'Something went wrong',
    status: 500,
    message: 'An unexpected error occurred while loading movies. Please try again.',
  });
});

// Start the web server first, then keep trying to connect to MongoDB until it works.
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

async function connectWithRetry() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB (MovieDB)');
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}. Retrying in 10 seconds...`);
    setTimeout(connectWithRetry, 10000);
  }
}
connectWithRetry();

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
