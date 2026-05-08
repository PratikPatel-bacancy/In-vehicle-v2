import { motion } from "motion/react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { useState } from "react";

type MuteMode = "all" | "high-priority" | "muted";

export function StatusRail() {
  const [muteMode, setMuteMode] = useState<MuteMode>("all");

  const cycleMuteMode = () => {
    setMuteMode((prev) => {
      if (prev === "all") return "high-priority";
      if (prev === "high-priority") return "muted";
      return "all";
    });
  };

  const getMuteConfig = () => {
    switch (muteMode) {
      case "all":
        return { icon: Volume2, label: "All Alerts" };
      case "high-priority":
        return { icon: Volume1, label: "High Priority Only" };
      case "muted":
        return { icon: VolumeX, label: "Muted (5min)" };
    }
  };

  const muteConfig = getMuteConfig();
  const MuteIcon = muteConfig.icon;

  return (
    <div className="h-8 border-b border-[var(--line)] bg-[var(--bg-1)] px-4 flex items-center gap-[18px]">
      {/* Status items */}
      <StatusItem label="RTK" value="FIX ±0.02m" status="good" />
      <StatusItem label="CAM A · FRONT" value="120fps" status="good" />
      <StatusItem label="CAM B · REAR" value="120fps" status="good" />
      <StatusItem label="LTE" value="−68 dBm" status="good" />
      <StatusItem label="CAD" value="Spillman · OK" status="good" />
      <StatusItem label="NCIC SYNC" value="02m ago" status="good" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Hotlist count */}
      <div className="flex items-center gap-2">
        <span className="font-mono uppercase text-[9px] text-[var(--text-3)]">
          HOTLIST
        </span>
        <span className="font-mono text-[10px] font-semibold text-[var(--text-1)]">
          12,438 plates
        </span>
      </div>

      {/* Mute toggle */}
      <button
        onClick={cycleMuteMode}
        className="h-6 px-3 rounded-full bg-[var(--bg-3)] hover:bg-[var(--bg-4)] border border-[var(--line)] flex items-center gap-2 transition-colors"
      >
        <MuteIcon
          size={12}
          className={
            muteMode === "muted" ? "text-[var(--text-3)]" : "text-[var(--accent)]"
          }
        />
        <span className="font-mono text-[9px] text-[var(--text-1)]">
          {muteConfig.label}
        </span>
      </button>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  value: string;
  status: "good" | "warning" | "error";
}

function StatusItem({ label, value, status }: StatusItemProps) {
  const statusColors = {
    good: "var(--good)",
    warning: "var(--amber)",
    error: "var(--hit)",
  };

  const color = statusColors[status];

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="font-mono uppercase text-[9px] text-[var(--text-3)]">
        {label}
      </span>
      <span className="font-mono text-[10px] font-semibold text-[var(--text-1)]">
        {value}
      </span>
    </div>
  );
}
