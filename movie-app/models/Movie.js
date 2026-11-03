const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true, unique: true },   // Movie ID
    name: { type: String, required: true, trim: true },        // Movie Name
    director: { type: String, required: true, trim: true },    // Director
    genre: { type: String, required: true, trim: true },       // Genre
    releaseYear: { type: Number, required: true },             // Release Year
    language: { type: String, required: true, trim: true },    // Language
    duration: { type: Number, required: true },                // Duration (minutes)
    rating: { type: Number, required: true, min: 0, max: 10 }, // Rating (out of 10)
    description: { type: String, required: true },             // Description
    posterUrl: { type: String, default: '' },                  // Poster Image URL
  },
  // Collection is named "Movies" explicitly, inside the MovieDB database.
  { collection: 'Movies' }
);

// Text-friendly index for searching by name
movieSchema.index({ name: 1 });

module.exports = mongoose.model('Movie', movieSchema);
