import express from "express";
import protect from "../middleware/authMiddleware.js";
import Subject from "../models/Subject.js";

const router = express.Router();

const defaultSubjects = [
  { id: 1, name: "Operating Systems", icon: "", color: "border-blue-500", progress: 0,
    topics: ["Process Management", "Memory Management", "File Systems", "Deadlocks", "Scheduling"] },
  { id: 2, name: "Computer Networks", icon: "", color: "border-green-500", progress: 0,
    topics: ["OSI Model", "TCP/IP", "HTTP/HTTPS", "DNS", "Routing"] },
  { id: 3, name: "Database Management", icon: "", color: "border-purple-500", progress: 0,
    topics: ["SQL Queries", "Normalization", "Transactions", "Indexing", "NoSQL"] },
  { id: 4, name: "Object Oriented Programming", icon: "", color: "border-yellow-500", progress: 0,
    topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Abstraction", "Encapsulation"] },
  { id: 5, name: "System Design", icon: "", color: "border-red-500", progress: 0,
    topics: ["Load Balancing", "Caching", "Database Sharding", "Microservices", "CAP Theorem"] },
  { id: 6, name: "Computer Architecture", icon: "", color: "border-pink-500", progress: 0,
    topics: ["CPU Pipeline", "Cache Memory", "Instruction Set", "Memory Hierarchy", "I/O Systems"] },
];

// GET current user's subjects — creates default if none exists
router.get("/", protect, async (req, res) => {
  try {
    let record = await Subject.findOne({ user: req.user.id });

    if (!record) {
      record = await Subject.create({ user: req.user.id, subjects: defaultSubjects });
    }

    res.json(record.subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update a subject's progress (+10 / -10)
router.patch("/:subjectId", protect, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { value } = req.body; // e.g. +10 or -10

    const record = await Subject.findOne({ user: req.user.id });
    if (!record) return res.status(404).json({ message: "Subjects not found" });

    const subject = record.subjects.find((s) => s.id === Number(subjectId));
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.progress = Math.min(100, Math.max(0, subject.progress + value));
    await record.save();

    res.json(record.subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 