import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // NEW
    selectedIcons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Icon"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
