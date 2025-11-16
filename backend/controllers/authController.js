import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }             // 1 week
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validate phone number (10 digits, numeric only)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        error: "Phone number must be exactly 10 digits" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      phone,
      password: hashedPassword
    });

    res.json({ 
      message: "User registered successfully",
      userId: user._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password required" });
    }

    const user = await User.findOne({ phone }).populate("selectedIcons");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        selectedIcons: user.selectedIcons
      },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};
