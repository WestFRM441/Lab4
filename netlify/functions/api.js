const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const API_KEY = "kmiiNCjWhCzqZUJCMwMCyHXwERcGgYyHaMztzrRm";

app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.post("/discover", async (req, res) => {
  const { query, type, genres } = req.body;

  let artist = type === "artist" ? query : null;
  let genre = type === "genre" ? query : null;
  if (Array.isArray(genres) && genres.length) genre = genres.join(",");

  let apiUrl = `https://api.discogs.com/database/search?token=${API_KEY}&per_page=20`;
  if (artist) apiUrl += `&artist=${artist}`;
  if (genre) apiUrl += `&genre=${genre}`;
  if (!artist && !genre && query) apiUrl += `&q=${query}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const items = data.results;
    const results = [];

    for (const item of items) {
      results.push({
        artist: item.title || artist,
        genre: item.genre?.join(", ") || genre,
        year: item.year,
        albumArt: item.cover_image,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message || "Something went wrong." });
  }
});

module.exports.handler = serverless(app);
