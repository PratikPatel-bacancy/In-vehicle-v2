import { motion } from "motion/react";
import { Activity, Camera, Database, Wifi, HardDrive } from "lucide-react";

interface StatusItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  status: "good" | "warning" | "error";
}

export function SystemStatus() {
  const statusItems: StatusItem[] = [
    { icon: Camera, label: "CAMERAS", value: "4/4", status: "good" },
    { icon: Database, label: "DATABASE", value: "SYNC", status: "good" },
    { icon: Wifi, label: "NETWORK", value: "5G", status: "good" },
    { icon: HardDrive, label: "STORAGE", value: "67%", status: "good" },
  ];

  const statusColors = {
    good: "var(--good)",
    warning: "var(--amber)",
    error: "var(--hit)",
  };

  return (
    <div className="space-y-2">
      {statusItems.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 border border-[var(--line)] bg-[var(--bg-2)] px-3 py-2.5 relative"
        >
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/4 to-transparent" />

          {/* Status dot */}
          <motion.div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[item.status] }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <item.icon size={16} className="text-[var(--text-2)] flex-shrink-0" />

          {/* Label */}
          <span className="text-[11px] font-mono uppercase tracking-[.14em] text-[var(--text-2)] flex-1">
            {item.label}
          </span>

          {/* Value */}
          <span
            className="text-[12px] font-mono font-semibold"
            style={{ color: statusColors[item.status] }}
          >
            {item.value}
          </span>
        </div>
      ))}

      {/* System time */}
      <div className="border border-[var(--line)] bg-[var(--bg-2)] px-3 py-2.5 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/4 to-transparent" />
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-[var(--accent)] flex-shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-[.14em] text-[var(--text-2)]">
            SYSTEM TIME
          </span>
        </div>
        <div className="mt-1 font-mono text-[13px] text-[var(--accent)] ml-[28px]">
          {new Date().toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
}
