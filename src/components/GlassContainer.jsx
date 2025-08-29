
import { motion } from "framer-motion";

export default function GlassContainer({
  children,
  onClick,
  as = "article",
  className = "",
  style = {},
  motionProps = {},   // 👈 new
}) {
  const Comp = motion[as] || motion.article;

  return (
    <Comp
      onClick={onClick}
      className={`glass ${className}`}
      style={style}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      {...motionProps}             // 👈 pass animations from parent
    >
      {children}
    </Comp>
  );
}
