import React, { useState } from "react";
import axios from "axios";
import "./LoginScreen.css";

const API = process.env.REACT_APP_API_URL;


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

        const res = await axios.post(`${API}/api/auth/register`, {
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

        const res = await axios.post(`${API}/api/auth/login`, payload);
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
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegister ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="login-input"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (10 digits)"
                required
                className="login-input"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="login-input"
              />
            </>
          )}

          {!isRegister && (
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or phone"
              required
              className="login-input"
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
            className="login-input"
          />

          <button type="submit" className="login-button">
            {isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</p>}

        <p
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="login-toggle"
        >
          {isRegister ? "Already have an account? Login" : "New user? Create an account"}
        </p>
      </div>
    </div>
  );
}
