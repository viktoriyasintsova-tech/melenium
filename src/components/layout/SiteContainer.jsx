export default function SiteContainer({ as: Tag = "div", className = "", children }) {
  return <Tag className={`site-container ${className}`.trim()}>{children}</Tag>;
}
