import React from "react";
import axios from "axios";
import "./Square.css";

export default function Square({ icon = {}, onClick }) {
  const src =
    icon.img_url ||
    icon.imageSrc ||
    icon.src ||
    (icon.filename ? `/images/${encodeURIComponent(icon.filename)}` : null) ||
    "/logo192.png";

  const handleClick = async () => {
    try {
      const recipientEmail = prompt("Enter email address to send message to:");

      if (recipientEmail) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
          alert("Please enter a valid email address");
          return;
        }

        const senderName = localStorage.getItem("userName") || "User";

        await axios.post("http://localhost:5000/api/email/send", {
          buttonLabel: icon.label,
          senderName,
          recipientEmail
        });
        alert(`"${icon.label}" sent to ${recipientEmail}!`);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert(err.response?.data?.error || "Failed to send email");
    }

    if (onClick) onClick();
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
          style={{
            width: 56,
            height: 56,
            objectFit: "contain",
            display: "block",
            margin: "0 auto 8px",
          }}
          onError={(e) => console.error(`Image failed to load: ${src}`, e)}
        />
      ) : null}
      <div className="square-label">{icon.label}</div>
    </button>
  );
}
