import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, Info, Shield } from "lucide-react";

interface ActivityItem {
  type: "hit" | "scan" | "info" | "warning";
  message: string;
  timestamp: string;
}

const mockActivity: ActivityItem[] = [
  {
    type: "hit",
    message: "HOTLIST MATCH: WNT4567 CA - Stolen Vehicle",
    timestamp: "14:23:45",
  },
  {
    type: "scan",
    message: "Plate scanned: ABC1234 CA - No match",
    timestamp: "14:23:17",
  },
  {
    type: "scan",
    message: "Plate scanned: XYZ5678 NY - No match",
    timestamp: "14:22:53",
  },
  {
    type: "warning",
    message: "Registration expired: DEF9012 TX",
    timestamp: "14:21:38",
  },
  {
    type: "info",
    message: "Camera 3 re-calibrated",
    timestamp: "14:20:05",
  },
  {
    type: "scan",
    message: "Plate scanned: GHI3456 FL - No match",
    timestamp: "14:20:14",
  },
];

export function ActivityFeed() {
  const getActivityStyle = (type: ActivityItem["type"]) => {
    switch (type) {
      case "hit":
        return {
          icon: Shield,
          color: "var(--hit)",
          bg: "var(--hit)/10",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "var(--amber)",
          bg: "var(--amber)/10",
        };
      case "scan":
        return {
          icon: CheckCircle,
          color: "var(--accent)",
          bg: "var(--accent)/5",
        };
      case "info":
        return {
          icon: Info,
          color: "var(--text-2)",
          bg: "var(--bg-3)",
        };
    }
  };

  return (
    <div className="h-full border border-[var(--line)] bg-[var(--bg-2)] flex flex-col overflow-hidden">
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/4 to-transparent" />

      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--line)] bg-[var(--bg-3)]">
        <span className="text-[10px] uppercase tracking-[.14em] text-[var(--text-2)] font-semibold">
          ACTIVITY LOG
        </span>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {mockActivity.map((item, idx) => {
          const style = getActivityStyle(item.type);
          const Icon = style.icon;

          return (
            <motion.div
              key={idx}
              className="px-3 py-2 border-b border-[var(--line)] hover:bg-[var(--bg-3)] transition-colors"
              initial={idx === 0 ? { opacity: 0, x: -10 } : false}
              animate={idx === 0 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <Icon
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: style.color }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] text-[var(--text-1)] leading-tight"
                    style={
                      item.type === "hit" ? { color: "var(--hit)" } : undefined
                    }
                  >
                    {item.message}
                  </p>
                  <p className="text-[9px] font-mono text-[var(--text-3)] mt-1">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
