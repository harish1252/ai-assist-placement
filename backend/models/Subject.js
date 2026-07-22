import mongoose from "mongoose";

const subjectItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  topics: [{ type: String }],
  progress: { type: Number, default: 0 },
});

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    subjects: [subjectItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema); 