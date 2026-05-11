import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

export type MuteState = "all" | "high" | "muted";

interface TopBarProps {
  scanCount: number;
  hitCount: number;
  muteState: MuteState;
  onMuteToggle: () => void;
}

export function TopBar({ scanCount, hitCount, muteState, onMuteToggle }: TopBarProps) {
  const muteConfig = {
    all:   { Icon: Volume2,  label: "ALL ALERTS",  color: "var(--text-2)" },
    high:  { Icon: Volume1,  label: "HIGH ONLY",   color: "var(--amber)"  },
    muted: { Icon: VolumeX,  label: "MUTED",       color: "var(--hit)"    },
  }[muteState];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${month}/${day}/${year} · ${hours}:${minutes}:${seconds}`;
  };

  const hitRate = scanCount > 0 ? ((hitCount / scanCount) * 100).toFixed(2) : "0.00";

  return (
    <div
      className="flex-shrink-0 h-14 border-b border-[var(--line)] px-5"
      style={{
        background: "linear-gradient(to bottom, var(--bg-1), var(--bg-0))",
      }}
    >
      <div className="h-full flex items-center gap-6">
        {/* Brand block */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div
            className="w-[26px] h-[26px] bg-[var(--accent)] rounded-[6px] flex items-center justify-center"
            style={{
              boxShadow: "0 0 16px var(--accent-glow)",
            }}
          >
            <span className="font-mono text-black font-extrabold text-[16px] leading-none">
              V
            </span>
          </div>

          {/* Brand name */}
          <span className="font-mono uppercase text-[16px] font-bold tracking-[.02em] text-[var(--text-0)]">
            VERIFLOW
          </span>

          {/* Divider */}
          <div className="h-[22px] w-px bg-[var(--line-2)] mx-3" />

          {/* Product name */}
          <span className="uppercase text-[12px] tracking-[.14em] text-[var(--text-2)]">
            SEECONTROL
          </span>
        </div>

        {/* Stats chips - pushed right */}
        <div className="ml-auto flex items-stretch h-full">
          <StatChip
            label="READS · SHIFT"
            value={scanCount.toLocaleString()}
            borderLeft
          />
          <StatChip
            label="HITS"
            value={hitCount.toString()}
            color="var(--accent)"
            borderLeft
          />
          <StatChip label="HIT RATE" value={`${hitRate}%`} borderLeft />
          <StatChip
            label="CONFIRMED"
            value="2"
            color="var(--good)"
            borderLeft
          />
          <StatChip
            label="UNIT"
            value="01"
            showPulse
            borderLeft
          />
        </div>

        {/* Mute toggle */}
        <button
          onClick={onMuteToggle}
          className="border-l border-[var(--line)] pl-5 flex items-center gap-1.5 transition-colors"
          style={{ color: muteConfig.color, background: "none", border: "none", borderLeft: "1px solid var(--line)", paddingLeft: 20, cursor: "pointer" }}
        >
          <muteConfig.Icon size={13} />
          <span className="font-mono text-[9px] font-semibold tracking-[.14em] uppercase">
            {muteConfig.label}
          </span>
        </button>

        {/* Clock */}
        <div className="border-l border-[var(--line)] pl-6">
          <span className="font-mono text-[13px] text-[var(--text-0)]">
            {formatDateTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface StatChipProps {
  label: string;
  value: string;
  color?: string;
  showPulse?: boolean;
  borderLeft?: boolean;
}

function StatChip({ label, value, color, showPulse, borderLeft }: StatChipProps) {
  return (
    <div
      className={`min-w-[84px] px-3.5 py-1.5 flex flex-col justify-center ${
        borderLeft ? "border-l border-[var(--line)]" : ""
      }`}
    >
      <div className="font-mono uppercase text-[9px] tracking-[.14em] text-[var(--text-3)] leading-none mb-1">
        {label}
      </div>
      <div className="flex items-center gap-1.5">
        {showPulse && (
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[var(--good)]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              boxShadow: "0 0 6px var(--good)",
            }}
          />
        )}
        <span
          className="font-mono text-[14px] font-semibold leading-none"
          style={{ color: color || "var(--text-0)" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
