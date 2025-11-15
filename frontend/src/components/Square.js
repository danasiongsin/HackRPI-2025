export default function Square({ imageSrc, title }) {
  return (
    <div
      style={{
        width: "150px",
        height: "150px",
        background: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <img
        src={imageSrc}
        alt={title}
        style={{ width: "60px", height: "60px", marginBottom: "8px" }}
      />
      <p>{title}</p>
    </div>
  );
}
