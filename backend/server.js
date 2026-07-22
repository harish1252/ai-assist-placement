import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dsaRoutes from "./routes/dsaRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js"; 
import subjectRoutes from "./routes/subjectRoutes.js"; 

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/dsa", dsaRoutes);

app.use("/api/dsa", dsaRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/api/interview", interviewRoutes); 

app.use("/api/interview", interviewRoutes);
app.use("/api/subjects", subjectRoutes); 

const PORT = process.env.PORT || 5000;

console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
