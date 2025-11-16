import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    // expect 10 digits; adjust to your format if needed
    match: [/^\d{10}$/, "Phone must be 10 digits"]
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    default: null
  },
  password: { type: String, required: true },
  selectedIcons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Icon" }],
  createdAt: { type: Date, default: Date.now }
});

// unique index on email only when it's a string (partial index)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);

export default mongoose.model("User", userSchema);
