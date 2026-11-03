# Movie Details App – Node.js + Express + MongoDB + EJS

Movie listing app that loads its data from a MongoDB database (`MovieDB`, collection `Movies`) using Mongoose.

## Features

- Movie listing page with posters, rating, year, genre, language, director, duration and description
- Search by movie name (case-insensitive, partial match)
- Filter by genre (genre list is built from the database)
- Movie detail page (`/movies/:movieId`)
- Error handling: database not connected (503 page, auto-retries every 10 s), no movies in the database, no search results, unknown pages (404), query errors (500)
- 12 sample movies with local poster images, ready to insert

## Folder structure

```
movie-app/
├── server.js               # Express app + MongoDB connection (with retry)
├── package.json
├── .env.example            # Copy to .env
├── models/
│   └── Movie.js            # Mongoose schema (collection: Movies)
├── routes/
│   └── movies.js           # /movies list (search + genre filter) and /movies/:movieId
├── seed/
│   ├── movies.json         # Sample movie documents
│   └── seed.js             # Inserts the sample data
├── views/
│   ├── movies.ejs          # Listing page
│   ├── movie.ejs           # Detail page
│   ├── error.ejs           # Error / 404 page
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── public/
    ├── css/style.css
    └── images/posters/     # Sample poster images (SVG)
```

## MongoDB schema (`Movies` collection)

| Field         | Type   | Description                |
|---------------|--------|----------------------------|
| `movieId`     | Number | Movie ID (unique)          |
| `name`        | String | Movie name                 |
| `director`    | String | Director                   |
| `genre`       | String | Genre                      |
| `releaseYear` | Number | Release year               |
| `language`    | String | Language                   |
| `duration`    | Number | Duration in minutes        |
| `rating`      | Number | Rating out of 10           |
| `description` | String | Short description          |
| `posterUrl`   | String | Poster image URL or path   |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- MongoDB running locally ([Community Server](https://www.mongodb.com/try/download/community)) or a MongoDB Atlas connection string

## Installation and running

Extract the ZIP, open the `movie-app` folder in VS Code, open the integrated terminal and run:

```bash
# 1. Install dependencies
npm install

# 2. Create the environment file
cp .env.example .env              # Windows PowerShell: Copy-Item .env.example .env

# 3. Insert the sample movies into MovieDB.Movies
npm run seed

# 4. Start the app
npm start
```

Open **http://localhost:3000**.

For auto-restart while developing: `npm run dev`.

## Sample data

The sample documents are in `seed/movies.json`. `npm run seed` clears the `Movies` collection and inserts them.

Alternative using MongoDB's own tool:

```bash
mongoimport --db MovieDB --collection Movies --file seed/movies.json --jsonArray --drop
```

Or in `mongosh`:

```js
use MovieDB
db.Movies.insertOne({
  movieId: 13, name: "Your Movie", director: "Someone", genre: "Drama",
  releaseYear: 2024, language: "English", duration: 120, rating: 7.5,
  description: "Short description.", posterUrl: "/images/posters/your-movie.svg"
})
```

## Using your own posters

`posterUrl` can be a path inside `public/` (e.g. `/images/posters/foo.jpg`) or a full image URL (`https://...`). If an image fails to load, the page shows the movie title on a placeholder instead.

## Routes

| Method | Path                          | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/movies`                     | All movies                               |
| GET    | `/movies?search=incep`        | Search by name                           |
| GET    | `/movies?genre=Sci-Fi`        | Filter by genre                          |
| GET    | `/movies?search=dark&genre=Action` | Both filters together               |
| GET    | `/movies/:movieId`            | Details of one movie                     |

## Notes

- The sample poster images are simple generated placeholders, not official posters.
- If MongoDB is not running, the site still starts and shows a "Database unavailable" page; it connects automatically once MongoDB is up.
