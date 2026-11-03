require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MovieDB';

async function seed() {
  const movies = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf8'));

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB');

  await Movie.deleteMany({});
  const inserted = await Movie.insertMany(movies);
  console.log(`Inserted ${inserted.length} movies into MovieDB.Movies`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
