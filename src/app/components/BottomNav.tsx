import { Radar, BellDot, Search, Radio, MapPin } from "lucide-react";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { id: "patrol",   icon: Radar,   label: "PATROL"   },
  { id: "hits",     icon: BellDot, label: "HITS"     },
  { id: "lookup",   icon: Search,  label: "LOOKUP"   },
  { id: "bolo",     icon: Radio,   label: "BOLO"     },
  { id: "stakeout", icon: MapPin,  label: "STAKEOUT" },
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
      className="relative h-16 flex"
      style={{
        background: "linear-gradient(to bottom, var(--bg-1), var(--bg-0))",
        borderTop: "1px solid var(--line)",
      }}
    >
      {NAV_ITEMS.map((item, idx) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors group"
            style={{
              borderRight: idx < NAV_ITEMS.length - 1 ? "1px solid var(--line)" : "none",
              color: isActive ? "var(--accent)" : "var(--text-3)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
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
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 0 12px var(--accent)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            <Icon size={20} strokeWidth={1.5} />

            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
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
