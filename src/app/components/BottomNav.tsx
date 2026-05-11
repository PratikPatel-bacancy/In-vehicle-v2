import { Radar, BellDot, Search, Radio, MapPin } from "lucide-react";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { id: "patrol",   icon: Radar,   label: "PATROL",   color: "#00e5d4" },
  { id: "hits",     icon: BellDot, label: "HITS",     color: "#ff3355" },
  { id: "lookup",   icon: Search,  label: "LOOKUP",   color: "#ffaa00" },
  { id: "bolo",     icon: Radio,   label: "WATCH",    color: "#f97316" },
  { id: "stakeout", icon: MapPin,  label: "STAKEOUT", color: "#2bd97c" },
] as const;

type TabId = (typeof NAV_ITEMS)[number]["id"];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export type { TabId };

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      className="relative flex"
      style={{
        height: 100,
        background: "linear-gradient(to bottom, var(--bg-1), var(--bg-0))",
        borderTop: "1px solid var(--line)",
      }}
    >
      {NAV_ITEMS.map((item, idx) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        const color = item.color;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1.5 transition-all group"
            style={{
              borderRight: idx < NAV_ITEMS.length - 1 ? "1px solid var(--line)" : "none",
              color: isActive ? color : "var(--text-3)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.color = color;
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            }}
          >
            {/* Top accent bar — active only */}
            {isActive && (
              <motion.div
                layoutId="nav-accent-bar"
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px]"
                style={{
                  width: "60%",
                  backgroundColor: color,
                  boxShadow: `0 0 14px ${color}`,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            <Icon
              size={48}
              strokeWidth={isActive ? 2 : 1.5}
              style={{
                filter: isActive ? `drop-shadow(0 0 8px ${color})` : "none",
                transition: "filter 0.2s, stroke-width 0.2s",
              }}
            />

            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isActive ? "var(--text-1)" : "var(--text-3)",
                transition: "color 0.2s",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
