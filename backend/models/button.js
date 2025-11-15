const mongoose = require("mongoose");

const ButtonSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  label: { type: String, required: true },
  img_url: String,
  audio_url: String
});

module.exports = mongoose.model("Button", ButtonSchema);
