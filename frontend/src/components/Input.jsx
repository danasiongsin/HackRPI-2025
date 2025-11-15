import { useState } from "react";
import "./Input.css";

const categories = [
  {
    name: "Wants",
    items: [
      { id: 1, label: "Food" },
      { id: 2, label: "Drink" },
      { id: 3, label: "iPad" }
    ]
  },
  {
    name: "Needs",
    items: [
      { id: 4, label: "Bathroom" },
      { id: 5, label: "Help" },
      { id: 6, label: "Rest" }
    ]
  },
  {
    name: "Places",
    items: [
      { id: 7, label: "Home" },
      { id: 8, label: "School" },
      { id: 9, label: "Park" }
    ]
  }
];

export default function Input({ onContinue }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    const allItems = categories.flatMap((cat) => cat.items);
    onContinue(selected.map((id) => allItems.find((i) => i.id === id)));
  };

  return (
    <div className="screen">
      <h1 className="title">Select Items</h1>

      {categories.map((cat) => (
        <div key={cat.name} className="category">
          <h2 className="category-title">{cat.name}</h2>
          <div className="grid">
            {cat.items.map((item) => {
              const isActive = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`card ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        disabled={selected.length === 0}
        className={`continue ${selected.length === 0 ? "disabled" : ""}`}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
