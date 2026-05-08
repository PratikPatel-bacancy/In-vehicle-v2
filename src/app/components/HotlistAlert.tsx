import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface HotlistAlertProps {
  plate: string;
  state: string;
  reason: string;
  vehicle: string;
  onDismiss: () => void;
}

export function HotlistAlert({
  plate,
  state,
  reason,
  vehicle,
  onDismiss,
}: HotlistAlertProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onDismiss}
        />

        {/* Alert panel */}
        <motion.div
          className="relative w-full max-w-2xl border-2 bg-[var(--bg-1)] shadow-[0_20px_60px_rgba(0,0,0,.6)]"
          style={{ borderColor: "var(--hit)" }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            boxShadow: [
              "0 20px 60px rgba(255,51,85,.3)",
              "0 20px 80px rgba(255,51,85,.5)",
              "0 20px 60px rgba(255,51,85,.3)",
            ],
          }}
          transition={{
            boxShadow: { duration: 1.2, repeat: Infinity },
          }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="border-b border-[var(--hit)] bg-[var(--hit)]/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <AlertTriangle size={28} className="text-[var(--hit)]" />
              </motion.div>
              <div>
                <h2 className="uppercase tracking-[.18em] text-[var(--hit)] font-bold">
                  HOTLIST MATCH
                </h2>
                <p className="text-[11px] text-[var(--text-2)] uppercase tracking-[.14em] mt-0.5">
                  Immediate attention required
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-[var(--text-2)] hover:text-[var(--text-0)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Plate display */}
            <div className="text-center py-6 border border-[var(--hit)] bg-[var(--hit)]/5">
              <div className="font-mono tracking-[.24em] text-[var(--hit)]">
                <span className="text-[48px] font-bold">{plate}</span>
                <span className="ml-4 text-[24px] opacity-80">{state}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="REASON" value={reason} />
              <DetailItem label="VEHICLE" value={vehicle} />
              <DetailItem
                label="TIME"
                value={new Date().toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              />
              <DetailItem label="CONFIDENCE" value="98.7%" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-[var(--hit)] hover:bg-[var(--hit)]/90 text-white px-6 py-3 uppercase tracking-[.14em] font-semibold transition-colors">
                VIEW DETAILS
              </button>
              <button className="flex-1 border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--bg-3)] text-[var(--text-0)] px-6 py-3 uppercase tracking-[.14em] font-semibold transition-colors">
                DISMISS
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--bg-2)] p-3">
      <div className="text-[10px] uppercase tracking-[.14em] text-[var(--text-3)] mb-1">
        {label}
      </div>
      <div className="font-mono text-[14px] text-[var(--text-0)]">{value}</div>
    </div>
  );
}
