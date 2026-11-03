const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// Escape user input so it is treated as plain text inside a regex.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', (req, res) => res.redirect('/movies'));

// List all movies, with optional ?search= and ?genre= filters
router.get('/movies', async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();
    const genre = (req.query.genre || '').trim();

    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
    if (genre) filter.genre = genre;

    const [movies, genres, totalCount] = await Promise.all([
      Movie.find(filter).sort({ name: 1 }).lean(),
      Movie.distinct('genre'),
      Movie.countDocuments(),
    ]);

    res.render('movies', {
      title: 'Movies',
      movies,
      genres: genres.sort(),
      search,
      genre,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
});

// Single movie details
router.get('/movies/:movieId', async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId);
    if (!Number.isInteger(movieId)) return res.status(404).render('error', { title: 'Not found', message: 'Movie not found.', status: 404 });

    const movie = await Movie.findOne({ movieId }).lean();
    if (!movie) return res.status(404).render('error', { title: 'Not found', message: 'Movie not found.', status: 404 });

    res.render('movie', { title: movie.name, movie });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
