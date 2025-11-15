import mongoose from "mongoose";

const ButtonSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  label: { type: String, required: true },
  img_url: { type: String, default: "" },
  audio_url: { type: String, default: "" }
});

const Button = mongoose.model("Button", ButtonSchema);

export default Button;
