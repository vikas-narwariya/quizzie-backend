const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, "abcdef"); // Use your secret key
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.user = user; // Attach the user to the request
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = authenticateUser;
