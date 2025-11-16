import React, { useState } from "react";
import axios from "axios";

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      // Pass user back to App.js
      onLogin(user);

      alert(isRegister ? "Account created!" : "Logged in!");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        "Something went wrong. Try again."
      );
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password
      });
      setError("");
      onLogin(res.data); // calls App's handleLogin which saves to localStorage
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
          />
        )}

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegister ? "Create Account" : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      <p
        onClick={() => setIsRegister(!isRegister)}
        style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "New user? Create an account"}
      </p>
    </div>
  );
}
