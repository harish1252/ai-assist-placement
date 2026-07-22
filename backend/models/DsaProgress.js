import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  total: { type: Number, required: true },
  solved: { type: Number, required: true, default: 0 },
});

const dsaProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    topics: [topicSchema],
  },
  { timestamps: true }
);

export default mongoose.model("DsaProgress", dsaProgressSchema); 