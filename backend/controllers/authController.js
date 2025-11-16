import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const generateToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body || {};

    if (!name || !phone || !password) {
      return res.status(400).json({ error: "name, phone and password are required" });
    }

    const normalizedPhone = String(phone).trim();
    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({ error: "Phone must be exactly 10 digits" });
    }

    let normalizedEmail = null;
    if (email !== undefined && email !== null && String(email).trim() !== "") {
      normalizedEmail = String(email).trim().toLowerCase();
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    // check duplicates
    const existingPhone = await User.findOne({ phone: normalizedPhone }).lean();
    if (existingPhone) return res.status(400).json({ error: "Phone already registered" });

    if (normalizedEmail) {
      const existingEmail = await User.findOne({ email: normalizedEmail }).lean();
      if (existingEmail) return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone: normalizedPhone,
      email: normalizedEmail,
      password: hashed
    });

    const token = generateToken(user);
    return res.json({
      message: "User registered successfully",
      token,
      user: { _id: user._id, name: user.name, phone: user.phone, email: user.email }
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      const key = err.keyValue ? Object.keys(err.keyValue)[0] : null;
      if (key === "phone") return res.status(400).json({ error: "Phone already registered" });
      if (key === "email") return res.status(400).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: err.message || "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password, phone, email } = req.body || {};
    // support either: { identifier, password } or { phone, password } or { email, password }
    let user = null;
    if (identifier) {
      if (identifier.includes("@")) {
        user = await User.findOne({ email: String(identifier).trim().toLowerCase() });
      } else {
        user = await User.findOne({ phone: String(identifier).trim() });
      }
    } else if (email) {
      user = await User.findOne({ email: String(email).trim().toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone: String(phone).trim() });
    }

    if (!user) return res.status(400).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, phone: user.phone, email: user.email ?? null }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};
