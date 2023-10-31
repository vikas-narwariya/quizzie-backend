const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect("mongodb+srv://vikas:vikas123@cluster0.9uhp0.mongodb.net/quiz-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(bodyParser.json());

// Use your routes

app.use(cors());
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/stats"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/quiz"));
app.use("/api", require("./routes/question"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
