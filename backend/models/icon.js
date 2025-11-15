import mongoose from "mongoose";

const IconSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    img_url: { type: String, default: "" },
    audio_url: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: true }
);

const Icon = mongoose.model("Icon", IconSchema);

export default Icon;
