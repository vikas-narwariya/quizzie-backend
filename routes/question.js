const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const authenticateUser = require("../middleware/authMiddleware");

// Add a new question to a quiz
router.post("/questions", authenticateUser, async (req, res) => {
  try {
    const { text, options, timer, quizId, selectedOption } = req.body;
    const userId = req.user._id;
    const question = new Question({
      text,
      options,
      timer,
      selectedOption,
      quizId,
      userId,
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Question creation failed" });
  }
});

// Evaluate user's answer for a Q&A question and calculate score

router.get("/questions/:quizId", async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.post("/questions/:questionId/evaluate", async (req, res) => {
  const questionId = req.params.questionId;
  const { userAnswer } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (
      question.options.some(
        (option) => option.isCorrect && option.text === userAnswer
      )
    ) {
      // User's answer is correct
      res.status(200).json({ message: "Correct answer", score: 1 });
    } else {
      // User's answer is incorrect
      res.status(200).json({ message: "Incorrect answer", score: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

// Implement other question-related routes as needed
// ...

module.exports = router;
