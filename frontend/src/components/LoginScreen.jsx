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
    <div style={{ width: "300px", margin: "auto", marginTop: "80px" }}>
      <h2>{isRegister ? "Create Account" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
          />
        )}

        <input
          type="text"
          placeholder="Phone number (10 digits)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />

        <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
          {isRegister ? "Create Account" : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>
      )}

      <p
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
        }}
        style={{ color: "blue", cursor: "pointer", marginTop: "10px", textAlign: "center" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "New user? Create an account"}
      </p>
    </div>
  );
}
