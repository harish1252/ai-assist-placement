import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  questions: [questionSchema],
});

const interviewPrepSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    categories: [categorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("InterviewPrep", interviewPrepSchema); 