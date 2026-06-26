export default function PageShell({ children, className = "" }) {
  return (
    <div className="site-main-offset min-h-screen bg-[#faf8f4] text-[#1c1c1c]">
      <main className={`site-container pb-12 sm:pb-14 lg:pb-16 ${className}`.trim()}>
        <div className="site-page-top">{children}</div>
      </main>
    </div>
  );
}
