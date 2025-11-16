import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Input.css";

export default function Input({ onContinue, user }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?._id || localStorage.getItem("userId");
  const didAutoContinue = useRef(false);

  // Load categories and their icons from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const catRes = await axios.get("http://localhost:5000/api/board/categories");
        const cats = catRes.data || [];

        const catsWithItems = await Promise.all(
          cats.map(async (c) => {
            try {
              const iconsRes = await axios.get(
                `http://localhost:5000/api/icons/by-category/${c._id}`
              );
              const items = (iconsRes.data || []).map((icon) => ({
                _id: icon._id,
                label: icon.label,
                imageSrc: icon.img_url || ""
              }));
              return { ...c, items };
            } catch (err) {
              console.error("Error loading icons for category", c._id, err);
              return { ...c, items: [] };
            }
          })
        );

        setCategories(catsWithItems);

        // load user's previously selected icons (if any)
        if (userId) {
          try {
            const selRes = await axios.get(`http://localhost:5000/api/users/${userId}/icons`);
            const selIds = selRes.data.map((i) => i._id);
            setSelected(selIds);

            // if user already has selections, auto-continue once
            if (selIds.length > 0 && !didAutoContinue.current) {
              didAutoContinue.current = true;
              const allItems = catsWithItems.flatMap((c) => c.items || []);
              const detailedSelected = allItems.filter((i) => selIds.includes(i._id));
              // give parent the selected items to skip the selection screen
              onContinue?.(detailedSelected);
            }
          } catch (err) {
            console.warn("Could not load user's selected icons", err);
          }
        }
      } catch (err) {
        console.error("Error loading categories/icons:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, onContinue]);

  // Toggle selection (works with string ObjectId ids)
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Save selection to backend and build detailed list for display
  const handleContinue = async () => {
    try {
      if (!userId) {
        alert("User not found — please log in.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/users/${userId}/select-icons`,
        { iconIds: selected }
      );

      const allItems = categories.flatMap((c) => c.items || []);
      const detailedSelected = allItems.filter((i) => selected.includes(i._id));

      onContinue(detailedSelected);
    } catch (err) {
      console.error("Error saving selected icons:", err);
      alert("Failed to save selection. Try again.");
    }
  };

  if (loading) return <div className="screen"><p>Loading categories...</p></div>;

  return (
    <div className="screen">
      <h1 className="title">Select Items</h1>

      {categories.map((cat) => (
        <div key={cat._id} className="category">
          <h2 className="category-title">{cat.name}</h2>

          <div className="grid">
            {(cat.items || []).map((item) => {
              const active = selected.includes(item._id);

              return (
                <button
                  key={item._id}
                  onClick={() => toggle(item._id)}
                  className={`card ${active ? "active" : ""}`}
                >
                  {item.imageSrc && (
                    <img
                      src={item.imageSrc}
                      alt={item.label}
                      style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                    />
                  )}
                  <div>{item.label}</div>
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
