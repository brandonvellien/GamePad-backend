const express = require("express");
const User = require("../models/User");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction pour convertir un fichier en base64
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// Route pour l'inscription
router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const generateToken = uid2(16);
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (!req.body.username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const newUser = new User({
      account: {
        username: req.body.username,
      },
      email: req.body.email,
      token: generateToken,
      hash: hash,
      salt: salt,
    });

    if (req.files && req.files.picture) {
      const pictureToUpload = req.files.picture;
      const result = await cloudinary.uploader.upload(
        convertToBase64(pictureToUpload)
      );
      newUser.account.image = result.secure_url;
    }

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.account.username,
        image: newUser.account.image,
        email: newUser.email,
        token: newUser.token,
      },
    });

    console.log(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour la connexion
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "email or password incorrect" });
    }
    const passwordHashed = SHA256(req.body.password + user.salt).toString(
      encBase64
    );
    if (passwordHashed === user.hash) {
      return res.status(200).json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      return res.status(400).json({ message: "email or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
