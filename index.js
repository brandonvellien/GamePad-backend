require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

// Importer les routes
const homeRouter = require("./Routes/home");
const gameRouter = require("./Routes/game");
const userRouter = require("./Routes/user");
const favorisRouter = require("./Routes/favoris");
const reviewRouter = require("./Routes/reviews");
// Importer les modèles

// Utilisation de mes routes
app.use(homeRouter);
app.use(gameRouter);
app.use(userRouter);
app.use(favorisRouter);
app.use(reviewRouter);

// Route par défaut pour gérer les routes non définies
app.all("*", (req, res) => {
  res.status(404).json({ message: "all routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
