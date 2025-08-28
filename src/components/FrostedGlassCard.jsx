import "./FrostedGlassCard.css";

export default function FrostedGlassCard({ imageSrc, children }) {
  return (
    <div className="frosted-card-container">
      <div className="frosted-card-image">
        <img src={imageSrc} alt="Profile" />
      </div>
      <div className="frosted-card-glass">
        {children}
      </div>
    </div>
  );
}