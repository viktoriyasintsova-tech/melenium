import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const { ref, isVisible } = useScrollReveal({ once: true });

  return (
    <Tag
      ref={ref}
      className={`site-reveal ${isVisible ? "site-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
