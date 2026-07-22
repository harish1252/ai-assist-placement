import express from "express";
import protect from "../middleware/authMiddleware.js";
import InterviewPrep from "../models/InterviewPrep.js";

const router = express.Router();

const defaultCategories = [
  {
    id: 1, name: "Technical Interview", icon: "💻", color: "border-blue-500",
    questions: [
      { id: 1, question: "What is the difference between == and === in JavaScript?", done: false },
      { id: 2, question: "Explain event loop in JavaScript.", done: false },
      { id: 3, question: "What is closure in JavaScript?", done: false },
      { id: 4, question: "Difference between SQL and NoSQL databases?", done: false },
      { id: 5, question: "What is REST API?", done: false },
    ],
  },
  {
    id: 2, name: "React Interview", icon: "⚛️", color: "border-cyan-500",
    questions: [
      { id: 1, question: "What is the difference between state and props?", done: false },
      { id: 2, question: "Explain useEffect hook with example.", done: false },
      { id: 3, question: "What is virtual DOM?", done: false },
      { id: 4, question: "What is the use of useContext?", done: false },
      { id: 5, question: "Difference between controlled and uncontrolled components?", done: false },
    ],
  },
  {
    id: 3, name: "DSA Interview", icon: "🧠", color: "border-purple-500",
    questions: [
      { id: 1, question: "Explain time and space complexity.", done: false },
      { id: 2, question: "What is the two pointer technique?", done: false },
      { id: 3, question: "Difference between BFS and DFS?", done: false },
      { id: 4, question: "What is dynamic programming?", done: false },
      { id: 5, question: "How does quicksort work?", done: false },
    ],
  },
  {
    id: 4, name: "HR Interview", icon: "🤝", color: "border-green-500",
    questions: [
      { id: 1, question: "Tell me about yourself.", done: false },
      { id: 2, question: "What are your strengths and weaknesses?", done: false },
      { id: 3, question: "Where do you see yourself in 5 years?", done: false },
      { id: 4, question: "Why do you want to join this company?", done: false },
      { id: 5, question: "Describe a challenge you faced and how you solved it.", done: false },
    ],
  },
  {
    id: 5, name: "System Design", icon: "⚙️", color: "border-yellow-500",
    questions: [
      { id: 1, question: "How would you design a URL shortener?", done: false },
      { id: 2, question: "Explain load balancing.", done: false },
      { id: 3, question: "What is caching and when to use it?", done: false },
      { id: 4, question: "How does a CDN work?", done: false },
      { id: 5, question: "Design a chat application like WhatsApp.", done: false },
    ],
  },
  {
    id: 6, name: "CS Fundamentals", icon: "📖", color: "border-red-500",
    questions: [
      { id: 1, question: "What is a process vs thread?", done: false },
      { id: 2, question: "Explain deadlock and how to prevent it.", done: false },
      { id: 3, question: "What is normalization in databases?", done: false },
      { id: 4, question: "Explain OSI model layers.", done: false },
      { id: 5, question: "What is virtual memory?", done: false },
    ],
  },
];

// GET current user's interview prep progress — creates default if none exists
router.get("/", protect, async (req, res) => {
  try {
    let prep = await InterviewPrep.findOne({ user: req.user.id });

    if (!prep) {
      prep = await InterviewPrep.create({ user: req.user.id, categories: defaultCategories });
    }

    res.json(prep.categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH toggle a specific question's done status
router.patch("/:categoryId/:questionId", protect, async (req, res) => {
  try {
    const { categoryId, questionId } = req.params;

    const prep = await InterviewPrep.findOne({ user: req.user.id });
    if (!prep) return res.status(404).json({ message: "Progress not found" });

    const category = prep.categories.find((c) => c.id === Number(categoryId));
    if (!category) return res.status(404).json({ message: "Category not found" });

    const question = category.questions.find((q) => q.id === Number(questionId));
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.done = !question.done;
    await prep.save();

    res.json(prep.categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 