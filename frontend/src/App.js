import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import Input from "./components/Input";
import Square from "./components/Square";
import "./App.css";
import { speakWithElevenLabs } from "./utils/tts";

function App() {
  const [user, setUser] = useState(null);
  const [selectedIcons, setSelectedIcons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Load user and selected icons from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedIcons = localStorage.getItem("selectedIcons");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedIcons) {
        setSelectedIcons(JSON.parse(savedIcons));
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save user to localStorage when it changes
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Save selected icons to localStorage when they change
  const handleContinue = (icons) => {
    setSelectedIcons(icons);
    localStorage.setItem("selectedIcons", JSON.stringify(icons));
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setSelectedIcons(null);
    localStorage.removeItem("user");
    localStorage.removeItem("selectedIcons");
  };

  const handleSquareClick = (icon) => {
    console.log("Square clicked:", icon);
    speakWithElevenLabs(
    icon.label,
    () => setSpeakingId(icon._id),  // start
    () => setSpeakingId(null)       // end
  );

  
};
  
const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);  // hide after 3 sec
  };
  const [speakingId, setSpeakingId] = useState(null);

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }
  

  return (
    <div className="app-background">
      {/* 1. Login screen */}
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : 
      // 2. Selection screen
      !selectedIcons ? (
        <Input onContinue={handleContinue} user={user} />
      ) : (
        // 3. Display selected icons
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Your Board
            </h1>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#5b3ef5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
          {toast && (
            <div className="toast-popup">
              {toast}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {selectedIcons.map((item) => (
              <Square
                key={item._id}
                icon={item}
                onClick={() => handleSquareClick(item)}
                isSpeaking={speakingId === item._id}
                showToast={showToast}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
