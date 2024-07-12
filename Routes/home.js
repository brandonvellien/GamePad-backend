const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.GAMEPAD_API_KEY;

// Route pour obtenir la liste des jeux populaires du moment avec pagination
router.get("/home", async (req, res) => {
  const page = req.query.page || 1;
  const page_size = req.query.page_size || 20;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-relevance&dates=2024-06-10,2024-07-01&page=${page}&page_size=${page_size}`;

  try {
    const response = await axios.get(url);
    res.json({
      results: response.data.results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      error: "An error occurred while fetching data from the RAWG API",
    });
  }
});

// Route pour obtenir les résultats de la recherche avec pagination
router.get("/home/searchresults", async (req, res) => {
  const {
    query,
    platform,
    genres,
    sorts,
    page = 1,
    page_size = 25,
  } = req.query;
  let url = `https://api.rawg.io/api/games?key=${apiKey}&search=${query}&page=${page}&page_size=${page_size}`;

  if (platform) {
    url += `&platforms=${platform}`;
  }
  if (genres) {
    url += `&genres=${genres}`;
  }
  if (sorts) {
    url += `&ordering=${sorts}`;
  }

  try {
    const response = await axios.get(url);
    res.json({
      results: response.data.results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "An error occurred while fetching data from the RAWG API",
    });
  }
});

module.exports = router;
