const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id, email: user.email }, "abcdef", {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate a JWT token and send it in the response
    const token = jwt.sign({ userId: user._id, email: user.email }, "abcdef", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
