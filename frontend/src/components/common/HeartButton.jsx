import { useState } from "react";
import { useSavedItems } from "../../context/SavedItemsContext";
import "./HeartButton.css";

function HeartButton({
  product,
  size = "md", // "sm" | "md" | "lg"
  className = "",
  showParticles = true,
  onToggle,
}) {
  const { isSaved, toggleSave } = useSavedItems();
  const saved = isSaved(product);
  const [animating, setAnimating] = useState(false);
  const [lastAction, setLastAction] = useState(null); // "save" | "unsave"

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const willBeSaved = !saved;
    setLastAction(willBeSaved ? "save" : "unsave");
    setAnimating(true);

    toggleSave(product);
    onToggle?.(willBeSaved, product);

    // Reset animation state after completion
    setTimeout(() => {
      setAnimating(false);
    }, 550);
  };

  const animClass = animating
    ? lastAction === "save"
      ? "heart-btn--pop"
      : "heart-btn--deflate"
    : "";

  return (
    <button
      type="button"
      className={`heart-btn heart-btn--${size} ${saved ? "heart-btn--active" : ""} ${animClass} ${className}`}
      onClick={handleClick}
      aria-label={saved ? "Remove from Saved Items" : "Save to Saved Items"}
      aria-pressed={saved}
      title={saved ? "Saved to your capsule (click to unsave)" : "Save item to your capsule"}
    >
      {/* Optional Particle Burst on Save */}
      {showParticles && animating && lastAction === "save" && (
        <span className="heart-particles" aria-hidden="true">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
          <span className="particle p6" />
        </span>
      )}

      {/* Heart Icon SVG */}
      <svg
        className="heart-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="heart-path"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    </button>
  );
}

export default HeartButton;
