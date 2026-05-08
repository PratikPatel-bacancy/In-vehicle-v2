import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface CameraFeedProps {
  cameraId: string;
  label: string;
  isActive: boolean;
}

export function CameraFeed({ cameraId, label, isActive }: CameraFeedProps) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full border border-[var(--line)] bg-[var(--bg-2)] overflow-hidden">
      {/* Camera feed placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-1)] to-[var(--bg-3)] flex items-center justify-center">
        <div className="text-[var(--text-3)] font-mono uppercase tracking-[.18em] opacity-40">
          CAM {cameraId}
        </div>
      </div>

      {/* Scan line animation */}
      {isActive && (
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          style={{ top: `${scanProgress}%` }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Status indicator */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-[var(--good)]" : "bg-[var(--text-3)]"
          }`}
          animate={
            isActive
              ? { opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }
              : { opacity: 0.4 }
          }
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[11px] font-mono uppercase tracking-[.14em] text-[var(--text-2)]">
          {label}
        </span>
      </div>

      {/* Frame counter */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[var(--text-3)]">
        {Math.floor(Date.now() / 33) % 10000}
      </div>
    </div>
  );
}
