const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");
const mongoose = require("mongoose");

// Ajouter ou retirer un favori (toggle)
router.post("/favorites", isAuthenticated, async (req, res) => {
  const { gameId, gameName, gameImage } = req.body;
  try {
    console.log("User ID:", req.user.id);
    console.log("Game ID:", gameId);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user);

    const index = user.favorites.findIndex((fav) => fav.gameId === gameId);
    if (index > -1) {
      // Le jeu est déjà un favori, on le retire
      user.favorites.splice(index, 1);
      console.log("Game removed from favorites");
    } else {
      // Le jeu n'est pas un favori, on l'ajoute
      user.favorites.push({ gameId, gameName, gameImage });
      console.log("Game added to favorites");
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Obtenir les favoris de l'utilisateur
router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
