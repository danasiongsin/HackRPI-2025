import React from "react";
import axios from "axios";
import "./Square.css";

export default function Square({ icon = {}, onClick, isSpeaking, showToast }) {
  const src =
    icon.img_url ||
    icon.imageSrc ||
    icon.src ||
    (icon.filename ? `/images/${encodeURIComponent(icon.filename)}` : null) ||
    "/logo192.png";

  const handleClick = async () => {
    try {
      const senderName = localStorage.getItem("userName") || "User";
      const userId = localStorage.getItem("userId");

      // Prefer sending to the user's email stored in DB (pass userId).
      // If userId missing, fallback to prompting for recipient email.
      const payload = {
        buttonLabel: icon.label || "(no label)",
        senderName
      };

      if (userId) {
        payload.userId = userId;
      } else {
        const promptEmail = prompt("Enter recipient email:");
        if (!promptEmail) {
          alert("No recipient provided.");
          return;
        }
        payload.recipientEmail = promptEmail.trim().toLowerCase();
      }

      await axios.post("http://localhost:5000/api/email/send", payload);
      if (showToast) {
        // showToast(`"${icon.label}" sent to ${promptEmail}"`);
        showToast(`"${icon.label}" sent to email."`);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert(err.response?.data?.error || "Failed to send email");
    }

    if (onClick) onClick(icon);
  };

  return (
    <button
      className="square"
      onClick={handleClick}
      type="button"
      aria-label={icon.label || "icon"}
    >
      {src ? (
        <img
          src={src}
          alt={icon.label || "icon"}
          // style={{
          //   width: 56,
          //   height: 56,
          //   objectFit: "contain",
          //   display: "block",
          //   margin: "0 auto 8px"
          // }}
          className="square-image"
          onError={(e) => console.error(`Image failed to load: ${src}`, e)}
        />
      ) : null}

      {isSpeaking && (
        <div className="speaking-indicator">🔊</div>
      )}
      <div className="square-label">{icon.label}</div>
    </button>
  );
}
