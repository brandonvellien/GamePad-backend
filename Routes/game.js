const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.GAMEPAD_API_KEY;

// Route pour obtenir les détails d'un jeu
router.get("/home/:gameid", async (req, res) => {
  const { gameid } = req.params;
  const url = `https://api.rawg.io/api/games/${gameid}?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      error: "An error occurred while fetching data from the RAWG API",
    });
  }
});

// Route pour les jeux similaires
router.get("/home/:gameid/similargames", async (req, res) => {
  const { gameid } = req.params;
  const url = `https://api.rawg.io/api/games/${gameid}/game-series?key=${apiKey}&page_size=5`;
  try {
    const response = await axios.get(url);
    res.json(response.data.results);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      error: "An error occurred while fetching data from the RAWG API",
    });
  }
});

module.exports = router;
