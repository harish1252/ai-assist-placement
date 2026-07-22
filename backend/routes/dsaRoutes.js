import express from "express";
import protect from "../middleware/authMiddleware.js";
import DsaProgress from "../models/DsaProgress.js";

const router = express.Router();

const defaultTopics = [
  { id: 1, name: "Arrays", total: 20, solved: 0 },
  { id: 2, name: "Strings", total: 15, solved: 0 },
  { id: 3, name: "Linked List", total: 12, solved: 0 },
  { id: 4, name: "Stack & Queue", total: 10, solved: 0 },
  { id: 5, name: "Trees", total: 18, solved: 0 },
  { id: 6, name: "Graphs", total: 15, solved: 0 },
  { id: 7, name: "Dynamic Programming", total: 20, solved: 0 },
  { id: 8, name: "Sorting & Searching", total: 10, solved: 0 },
  { id: 9, name: "Recursion", total: 10, solved: 0 },
  { id: 10, name: "Greedy", total: 8, solved: 0 },
];

// GET current user's progress — creates default if none exists yet
router.get("/progress", protect, async (req, res) => {
  try {
    let progress = await DsaProgress.findOne({ user: req.user.id });

    if (!progress) {
      progress = await DsaProgress.create({ user: req.user.id, topics: defaultTopics });
    }

    res.json(progress.topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH — increment or decrement a specific topic
router.patch("/progress/:topicId", protect, async (req, res) => {
  try {
    const { topicId } = req.params;
    const { action } = req.body; // "increment" or "decrement"

    const progress = await DsaProgress.findOne({ user: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const topic = progress.topics.find((t) => t.id === Number(topicId));
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (action === "increment" && topic.solved < topic.total) {
      topic.solved += 1;
    } else if (action === "decrement" && topic.solved > 0) {
      topic.solved -= 1;
    }

    await progress.save();

    res.json(progress.topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 