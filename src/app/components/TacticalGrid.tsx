export function TacticalGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,.012) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,.012) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    />
  );
}
