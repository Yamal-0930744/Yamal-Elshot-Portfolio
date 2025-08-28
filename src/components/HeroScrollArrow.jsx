import React from "react";

export default function HeroScrollArrow({ target = "#about" }) {
  const onClick = (e) => {
    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button className="heroArrow" aria-label="Scroll to next section" onClick={onClick}>
      <span className="chev">⌄</span>
    </button>
  );
}
