import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Input from "./components/Input";
import Square from "./components/Square";

function App() {
  const [user, setUser] = useState(null); // store logged-in user
  const [selectedIcons, setSelectedIcons] = useState(null);

  return (
    <div>
      {/* 1. Login screen */}
      {!user ? (
        <LoginScreen onLogin={setUser} />
      ) : 
      // 2. Selection screen
      !selectedIcons ? (
        <Input onContinue={setSelectedIcons} user={user} />
      ) : (
        // 3. Display selected icons
        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Your Board
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {selectedIcons.map((item) => (
              <Square
                key={item.id}
                title={item.label}
                imageSrc={item.imageSrc}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
