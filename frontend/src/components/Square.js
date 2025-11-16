import React from "react";
import "./Input.css";

export default function Square({ icon = {}, onClick }) {
  // Log what we receive
  console.debug("Square received icon:", icon);

  const src =
    icon.img_url ||
    icon.imageSrc ||
    icon.src ||
    (icon.filename ? `/images/${encodeURIComponent(icon.filename)}` : null) ||
    "/logo192.png";

  console.debug(`Square rendering with src: ${src}`);

  return (
    <button
      className="square"
      onClick={onClick}
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
