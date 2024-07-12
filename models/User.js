const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  account: {
    username: { type: String, required: true },
    image: { type: String }, // Champ pour l'image de profil
  },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  token: { type: String, required: true },
  favorites: [
    {
      gameId: { type: String, required: true },
      gameName: { type: String, required: true },
      gameImage: { type: String },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
