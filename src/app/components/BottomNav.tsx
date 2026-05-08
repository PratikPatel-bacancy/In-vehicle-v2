import { Camera, Search, List, Map, Settings, Shield } from "lucide-react";
import { motion } from "motion/react";

export function BottomNav() {
  const navItems = [
    { icon: Camera, label: "CAMERAS", active: true },
    { icon: List, label: "DETECTIONS", active: false },
    { icon: Search, label: "SEARCH", active: false },
    { icon: Map, label: "MAP", active: false },
    { icon: Shield, label: "HOTLIST", active: false },
    { icon: Settings, label: "SYSTEM", active: false },
  ];

  return (
    <div className="h-16 border-t border-[var(--line-2)] bg-[var(--bg-1)]/90 backdrop-blur-sm px-6">
      <div className="h-full flex items-center justify-between">
        {/* Navigation items */}
        <div className="flex items-center gap-2">
          {navItems.map((item, idx) => (
            <NavButton
              key={idx}
              icon={item.icon}
              label={item.label}
              active={item.active}
            />
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--bg-3)] transition-colors uppercase tracking-[.14em] text-[11px] text-[var(--text-1)] font-semibold">
            EXPORT DATA
          </button>
          <button className="px-5 py-2.5 bg-[var(--hit)] hover:bg-[var(--hit)]/90 transition-colors uppercase tracking-[.14em] text-[11px] text-white font-semibold">
            EMERGENCY
          </button>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <button
      className={`relative px-4 py-2.5 border transition-all ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/10"
          : "border-[var(--line)] hover:border-[var(--line-2)] hover:bg-[var(--bg-2)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={16}
          className={active ? "text-[var(--accent)]" : "text-[var(--text-2)]"}
        />
        <span
          className={`text-[10px] uppercase tracking-[.14em] font-semibold ${
            active ? "text-[var(--accent)]" : "text-[var(--text-2)]"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Active indicator */}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
          layoutId="activeNav"
        />
      )}
    </button>
  );
}
