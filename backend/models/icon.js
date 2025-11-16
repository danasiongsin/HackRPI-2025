import mongoose from "mongoose";

const iconSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    default: ""
  },
  audio_url: {
    type: String,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Icon", iconSchema);
