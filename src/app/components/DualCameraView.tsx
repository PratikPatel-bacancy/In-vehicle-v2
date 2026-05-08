import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface CameraTileProps {
  cameraId: "A" | "B";
  label: string;
  isHit?: boolean;
}

export function DualCameraView() {
  return (
    <div className="flex-1 grid grid-cols-2 gap-px bg-[var(--line)]">
      <CameraTile cameraId="A" label="CAM A · FRONT" isHit={true} />
      <CameraTile cameraId="B" label="CAM B · REAR" isHit={false} />
    </div>
  );
}

function CameraTile({ cameraId, label, isHit }: CameraTileProps) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const plateData =
    cameraId === "A"
      ? { plate: "JLW 8931", state: "TX", confidence: "99.7" }
      : { plate: "8KAM 415", state: "CA", confidence: "99.1" };

  const roiColor = isHit ? "var(--hit)" : "var(--accent)";
  const roiGlow = isHit ? "var(--hit-glow)" : "var(--accent-glow)";

  return (
    <div className="relative bg-gradient-to-b from-[#6b7280] via-[#4b5563] to-[#374151] overflow-hidden group hover:z-10 transition-all">
      {/* Subtle building texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 30px,
            rgba(0,0,0,0.1) 30px,
            rgba(0,0,0,0.1) 31px
          )`,
        }}
      />

      {/* Vehicle SVG */}
      {cameraId === "A" ? <F150Vehicle /> : <CamryVehicle />}

      {/* Plate ROI box */}
      <motion.div
        className="absolute border-2"
        style={{
          left: cameraId === "A" ? "42%" : "44%",
          bottom: cameraId === "A" ? "22%" : "18%",
          width: cameraId === "A" ? "16%" : "12%",
          height: "6%",
          borderColor: roiColor,
          boxShadow: `0 0 12px ${roiGlow}`,
        }}
        animate={
          isHit
            ? {
                boxShadow: [
                  `0 0 12px ${roiGlow}`,
                  `0 0 24px ${roiGlow}`,
                  `0 0 12px ${roiGlow}`,
                ],
              }
            : {}
        }
        transition={isHit ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          top: `${scanProgress}%`,
          background: `linear-gradient(to right, transparent, ${roiColor}, transparent)`,
          opacity: scanProgress < 10 || scanProgress > 90 ? 0 : 0.7,
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Camera label */}
      <div
        className="absolute top-3 left-3 px-2.5 py-1.5 rounded flex items-center gap-2"
        style={{
          background: "rgba(5,7,9,.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[var(--hit)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-mono uppercase text-[10px] tracking-[.08em] text-[var(--text-1)]">
          {label}
        </span>
      </div>

      {/* Camera readout - bottom row */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        {/* Last plate chip */}
        <div
          className="px-3 py-1.5 rounded"
          style={{
            background: "rgba(5,7,9,.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <span
            className="font-mono text-[12px] font-semibold tracking-[.02em]"
            style={{ color: isHit ? "var(--hit)" : "var(--accent)" }}
          >
            {plateData.plate.replace(" ", "")}
            {isHit && " · HIT"}
          </span>
        </div>

        {/* Confidence chip */}
        <div
          className="px-3 py-1.5 rounded"
          style={{
            background: "rgba(5,7,9,.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <span
            className="font-mono text-[10px]"
            style={{ color: isHit ? "var(--hit)" : "var(--text-2)" }}
          >
            {plateData.confidence}%{isHit && " · HIT"}
          </span>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent)]/30 transition-all pointer-events-none" />
    </div>
  );
}

// F-150 rear view SVG component
function F150Vehicle() {
  return (
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      width="60%"
      height="50%"
      viewBox="0 0 400 300"
      fill="none"
    >
      {/* Truck bed */}
      <rect x="50" y="80" width="300" height="180" fill="#2a2f38" />
      <rect x="40" y="80" width="320" height="15" fill="#1a1f28" />

      {/* Cab roof */}
      <rect x="80" y="40" width="240" height="40" fill="#2a2f38" />

      {/* Tailgate */}
      <rect x="50" y="200" width="300" height="60" fill="#9ca3af" />
      <rect x="60" y="210" width="280" height="40" fill="#6b7280" />

      {/* FORD lettering */}
      <text
        x="200"
        y="235"
        textAnchor="middle"
        fill="#4b5563"
        fontSize="18"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        FORD
      </text>

      {/* License plate - Texas style */}
      <rect x="160" y="215" width="80" height="28" fill="white" />
      <rect x="160" y="215" width="80" height="6" fill="#cc0000" />
      <text
        x="200"
        y="236"
        textAnchor="middle"
        fill="black"
        fontSize="14"
        fontWeight="bold"
        fontFamily="monospace"
      >
        JLW 8931
      </text>

      {/* Taillights */}
      <rect x="55" y="220" width="30" height="35" fill="#cc0000" rx="3" />
      <rect x="315" y="220" width="30" height="35" fill="#cc0000" rx="3" />

      {/* Rear window */}
      <rect x="100" y="50" width="200" height="30" fill="#1a1f28" opacity="0.7" />
    </svg>
  );
}

// Camry rear view SVG component (approaching from behind)
function CamryVehicle() {
  return (
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      width="55%"
      height="45%"
      viewBox="0 0 400 280"
      fill="none"
    >
      {/* Car body */}
      <rect x="60" y="120" width="280" height="120" fill="#2a2f38" rx="8" />
      <rect x="80" y="100" width="240" height="20" fill="#1a1f28" />

      {/* Roof */}
      <rect x="100" y="60" width="200" height="40" fill="#2a2f38" rx="6" />

      {/* Trunk */}
      <rect x="70" y="200" width="260" height="40" fill="#6b7280" />

      {/* License plate */}
      <rect x="165" y="210" width="70" height="24" fill="white" />
      <text
        x="200"
        y="228"
        textAnchor="middle"
        fill="black"
        fontSize="12"
        fontWeight="bold"
        fontFamily="monospace"
      >
        8KAM 415
      </text>

      {/* Headlights (yellow, car approaching) */}
      <circle cx="100" cy="230" r="8" fill="#fbbf24" opacity="0.9" />
      <circle cx="300" cy="230" r="8" fill="#fbbf24" opacity="0.9" />
      <circle cx="100" cy="230" r="12" fill="#fbbf24" opacity="0.3" />
      <circle cx="300" cy="230" r="12" fill="#fbbf24" opacity="0.3" />

      {/* Taillights */}
      <rect x="65" y="220" width="25" height="15" fill="#cc0000" rx="2" opacity="0.4" />
      <rect x="310" y="220" width="25" height="15" fill="#cc0000" rx="2" opacity="0.4" />

      {/* Rear window */}
      <rect x="120" y="70" width="160" height="30" fill="#1a1f28" opacity="0.7" />
    </svg>
  );
}
