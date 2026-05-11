import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface PlateData {
  plate: string;
  state: string;
  timestamp: string;
  status: "normal" | "hotlist" | "warning";
  vehicle?: string;
  location?: string;
}

interface PlateDetectionProps {
  plate: PlateData;
  isNew?: boolean;
}

export function PlateDetection({ plate, isNew = false }: PlateDetectionProps) {
  const [flash, setFlash] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setFlash(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const statusColors = {
    normal: "var(--accent)",
    hotlist: "var(--hit)",
    warning: "var(--amber)",
  };

  const StatusIcon = {
    normal: CheckCircle,
    hotlist: Shield,
    warning: AlertTriangle,
  }[plate.status];

  return (
    <motion.div
      className={`relative border bg-[var(--bg-2)] p-3 transition-all duration-300 ${
        plate.status === "hotlist"
          ? "border-[var(--hit)]"
          : "border-[var(--line)]"
      }`}
      initial={isNew ? { opacity: 0, scale: 0.95 } : false}
      animate={
        isNew
          ? { opacity: 1, scale: 1 }
          : plate.status === "hotlist"
          ? {
              boxShadow: [
                "0 0 0 0 var(--hit-glow)",
                "0 0 20px 4px var(--hit-glow)",
                "0 0 0 0 var(--hit-glow)",
              ],
            }
          : {}
      }
      transition={
        plate.status === "hotlist"
          ? { duration: 1.2, repeat: Infinity }
          : { duration: 0.25 }
      }
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/4 to-transparent" />

      {/* Flash effect for new plates */}
      {flash && (
        <motion.div
          className="absolute inset-0 bg-[var(--accent)]"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Plate number */}
          <div
            className="font-mono tracking-[.18em] mb-1.5"
            style={{ color: statusColors[plate.status] }}
          >
            <span className="text-[20px] font-bold">{plate.plate}</span>
            <span className="ml-2 text-[13px] opacity-70">{plate.state}</span>
          </div>

          {/* Metadata */}
          <div className="space-y-0.5 text-[11px] text-[var(--text-2)]">
            {plate.vehicle && (
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-[.14em] text-[var(--text-3)]">
                  VEH
                </span>
                <span>{plate.vehicle}</span>
              </div>
            )}
            {plate.location && (
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-[.14em] text-[var(--text-3)]">
                  LOC
                </span>
                <span>{plate.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status icon */}
        <StatusIcon
          className="flex-shrink-0"
          size={20}
          style={{ color: statusColors[plate.status] }}
        />
      </div>

      {/* Timestamp */}
      <div className="mt-2 pt-2 border-t border-[var(--line)] text-[9px] font-mono text-[var(--text-3)]">
        {plate.timestamp}
      </div>
    </motion.div>
  );
}
