import { useState, useEffect } from "react";
import axios from "axios";
import "./Input.css";

export default function Input({ onContinue }) {
  // const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);

  const phone = localStorage.getItem("userPhone");

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

    const loadSelectedIcons = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/users/${phone}/icons`
      );

      // Saved icons → array of MongoDB IDs
      setSelected(res.data.map((icon) => icon._id));
    };



  // -----------------------------
  // 2. Toggle selection
  // -----------------------------
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // -----------------------------
  // 3. Save selection to backend
  // -----------------------------
  const handleContinue = async () => {
    await axios.post(
      `http://localhost:5000/api/users/${phone}/select-icons`,
      { iconIds: selected }
    );

    // Build final selection list for display
    const allItems = categories.flatMap((c) => c.items);
    const detailedSelected = allItems.filter((i) =>
      selected.includes(i.id)
    );

    onContinue(detailedSelected);
  };

  return (
    <div className="screen">
      <h1 className="title">Select Items</h1>

      {categories.map((cat) => (
        <div key={cat.id} className="category">
          <h2 className="category-title">{cat.name}</h2>

          <div className="grid">
            {cat.items.map((item) => {
              const active = selected.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`card ${active ? "active" : ""}`}
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
