export function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center text-sm border-t"
      style={{
        color: "var(--text-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Ernest Hysa. Built with Next.js.
      </p>
    </footer>
  );
}
