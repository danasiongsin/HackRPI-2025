import React, { useState } from "react";
import axios from "axios";
import "./LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate phone number on frontend
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    // Validate password length on register
    if (isRegister && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      let response;

      if (isRegister) {
        response = await axios.post("http://localhost:5000/api/auth/register", {
          name,
          phone,
          password
        });
      } else {
        response = await axios.post("http://localhost:5000/api/auth/login", {
          phone,
          password
        });
      }

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("user", JSON.stringify(user));

      setError(""); // Clear any previous errors
      onLogin(user);

      alert(isRegister ? "Account created!" : "Logged in!");

    } catch (err) {
      console.error("Login/Register error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      const errorMessage = err.response?.data?.error || err.message || "Something went wrong. Try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegister ? "Create Account" : "Welcome Back!"}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <input
              className="login-input"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            className="login-input"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            {isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p
          className="login-toggle"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New here? Create an account"}
        </p>
      </div>
    </div>
  );
}
