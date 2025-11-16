import React, { useState } from "react";
import axios from "axios";
import "./LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // phone or email for login
  const [phone, setPhone] = useState(""); // for register
  const [email, setEmail] = useState(""); // optional for register
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        if (!phoneRegex.test(phone.trim())) {
          setError("Phone must be exactly 10 digits");
          return;
        }
        if (email && !emailRegex.test(email.trim().toLowerCase())) {
          setError("Invalid email format");
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name,
          phone: phone.trim(),
          email: email ? email.trim().toLowerCase() : null,
          password,
        });
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userPhone", user.phone || "");
        localStorage.setItem("user", JSON.stringify(user));
        setError("");
        onLogin(user);
      } else {
        // login: identifier may be email or phone
        const id = identifier.trim();
        let payload;
        if (id.includes("@")) {
          if (!emailRegex.test(id.toLowerCase())) {
            setError("Invalid email format");
            return;
          }
          payload = { email: id.toLowerCase(), password };
        } else {
          if (!phoneRegex.test(id)) {
            setError("Phone must be exactly 10 digits");
            return;
          }
          payload = { phone: id, password };
        }

        const res = await axios.post("http://localhost:5000/api/auth/login", payload);
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userPhone", user.phone || "");
        localStorage.setItem("user", JSON.stringify(user));
        setError("");
        onLogin(user);
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div style={{ width: 340, margin: "auto", marginTop: 80 }}>
      <h2 style={{ textAlign: "center" }}>{isRegister ? "Create Account" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (10 digits)"
              required
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />
          </>
        )}

        {!isRegister && (
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or phone"
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        )}

        {!isRegister && (
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            Enter email (a@b.com) or phone (1234567890)
          </div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          {isRegister ? "Create Account" : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</p>}

      <p
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
        }}
        style={{ color: "blue", cursor: "pointer", marginTop: 10, textAlign: "center" }}
      >
        {isRegister ? "Already have an account? Login" : "New user? Create an account"}
      </p>
    </div>
  );
}
