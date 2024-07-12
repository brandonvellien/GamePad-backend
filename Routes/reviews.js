const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const isAuthenticated = require("../middleware/isAuthenticated");

// Poster une review
router.post("/reviews", isAuthenticated, async (req, res) => {
  try {
    const { game, content, rating } = req.body;
    const existingReview = await Review.findOne({ user: req.user._id, game });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this game" });
    }
    const review = new Review({
      user: req.user._id,
      game,
      content,
      rating,
    });
    await review.save();

    // Populate user information before sending the response
    await review.populate("user", "account.username");

    // Send the populated review
    res.status(201).json(review);
  } catch (error) {
    console.error("Error posting review:", error);
    res
      .status(500)
      .json({ message: "Error posting review", error: error.message });
  }
});

// Obtenir les reviews pour un jeu
router.get("/reviews/:gameId", async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId })
      .sort("-votes")
      .populate("user", "account.username");
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
});

// Voter pour une review
router.post("/reviews/:reviewId/vote", isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Vérifier si l'utilisateur a déjà voté
    if (review.voters && review.voters.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already voted for this review" });
    }

    // Incrémenter le nombre de votes et ajouter l'utilisateur à la liste des votants
    review.votes += 1;
    if (!review.voters) {
      review.voters = [];
    }
    review.voters.push(req.user._id);

    await review.save();
    res.json({ votes: review.votes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error voting for review", error: error.message });
  }
});

module.exports = router;
