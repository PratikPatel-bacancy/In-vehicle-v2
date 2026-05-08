import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, Maximize2 } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";

interface CameraTileProps {
  cameraId: "A" | "B";
  label: string;
  isHit?: boolean;
  onClick?: () => void;
}

export function DualCameraView() {
  const [fullscreen, setFullscreen] = useState<"A" | "B" | null>(null);

  return (
    <>
      <div className="flex-1 grid grid-cols-2 gap-px bg-[var(--line)]">
        <CameraTile cameraId="A" label="CAM A · FRONT" isHit={true} onClick={() => setFullscreen("A")} />
        <CameraTile cameraId="B" label="CAM B · REAR" isHit={false} onClick={() => setFullscreen("B")} />
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="fullscreen"
            className="fixed inset-0 z-[90] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: "rgba(5,7,9,.97)", backdropFilter: "blur(8px)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: fullscreen === "A" ? "var(--hit)" : "var(--accent)" }}
                />
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-1)" }}>
                  CAM {fullscreen} · {fullscreen === "A" ? "FRONT" : "REAR"} — FULLSCREEN
                </span>
              </div>
              <button
                onClick={() => setFullscreen(null)}
                style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.05)", border: "1px solid var(--line-2)", cursor: "pointer", color: "var(--text-2)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-0)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)"; }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <CameraTileInner cameraId={fullscreen} isHit={fullscreen === "A"} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid var(--line)", pointerEvents: "none" }} />
            </div>

            <div style={{ padding: "10px 20px", borderTop: "1px solid var(--line)", background: "var(--bg-1)", display: "flex", gap: 24 }}>
              {[["FEED","LIVE"],["RESOLUTION","1920 × 1080"],["FRAME RATE","30 FPS"],["STATUS","RECORDING"]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-1)" }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CameraTileInner({ cameraId, isHit }: { cameraId: "A" | "B"; isHit: boolean }) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const plateData = cameraId === "A"
    ? { plate: "JLW 8931", state: "TX", confidence: "99.7" }
    : { plate: "8KAM 415", state: "CA", confidence: "99.1" };

  const roiColor = isHit ? "var(--hit)" : "var(--accent)";
  const roiGlow  = isHit ? "var(--hit-glow)" : "var(--accent-glow)";
  const label    = cameraId === "A" ? "CAM A · FRONT" : "CAM B · REAR";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Scene background — parking lot (A) or road (B) */}
      {cameraId === "A" ? <ParkingLotScene /> : <RoadScene />}

      {/* Vehicle illustration */}
      {cameraId === "A" ? <F150RearView /> : <CamryFrontView />}

      {/* ALPR scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          top: `${scanProgress}%`,
          background: `linear-gradient(to right, transparent, ${roiColor}, transparent)`,
          opacity: scanProgress < 10 || scanProgress > 90 ? 0 : 0.65,
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Plate ROI box */}
      <motion.div
        className="absolute border-2"
        style={{
          left: cameraId === "A" ? "42%" : "44%",
          bottom: cameraId === "A" ? "22%" : "20%",
          width: cameraId === "A" ? "16%" : "12%",
          height: "6%",
          borderColor: roiColor,
          boxShadow: `0 0 12px ${roiGlow}`,
        }}
        animate={isHit ? { boxShadow: [`0 0 12px ${roiGlow}`, `0 0 24px ${roiGlow}`, `0 0 12px ${roiGlow}`] } : {}}
        transition={isHit ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
      />

      {/* Camera label */}
      <div className="absolute top-3 left-3 px-2.5 py-1.5 flex items-center gap-2" style={{ background: "rgba(5,7,9,.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.08)" }}>
        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: isHit ? "var(--hit)" : "var(--accent)" }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
        <span className="font-mono uppercase text-[10px] tracking-[.08em] text-[var(--text-1)]">{label}</span>
      </div>

      {/* Bottom badge row */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="px-3 py-1.5" style={{ background: "rgba(5,7,9,.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.08)" }}>
          <span className="font-mono text-[12px] font-semibold tracking-[.02em]" style={{ color: isHit ? "var(--hit)" : "var(--accent)" }}>
            {plateData.plate.replace(" ", "")}{isHit && " · HIT"}
          </span>
        </div>
        <div className="px-3 py-1.5" style={{ background: "rgba(5,7,9,.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.08)" }}>
          <span className="font-mono text-[10px]" style={{ color: isHit ? "var(--hit)" : "var(--text-2)" }}>
            {plateData.confidence}%{isHit && " · HIT"}
          </span>
        </div>
      </div>
    </div>
  );
}

function CameraTile({ cameraId, label, isHit, onClick }: CameraTileProps) {
  return (
    <div className="relative overflow-hidden group hover:z-10 transition-all cursor-pointer" onClick={onClick}>
      <CameraTileInner cameraId={cameraId} isHit={isHit ?? false} />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1.5" style={{ background: "rgba(5,7,9,.75)", border: "1px solid rgba(255,255,255,.12)" }}>
          <Maximize2 size={12} className="text-[var(--text-1)]" />
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent)]/30 transition-all pointer-events-none" />
    </div>
  );
}

/* ─── IMAGE 3 FALLBACK: Cam A — Parking lot scene ────────────────────── */

function ParkingLotScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6e8090" />
          <stop offset="55%" stopColor="#8a9caa" />
          <stop offset="100%" stopColor="#a8b8c2" />
        </linearGradient>
        <linearGradient id="hazeA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0bec8" stopOpacity="0" />
          <stop offset="100%" stopColor="#b8c4cc" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="asphaltA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303438" />
          <stop offset="100%" stopColor="#1c1f22" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="560" height="210" fill="url(#skyA)" />
      {/* Horizon haze */}
      <rect y="170" width="560" height="40" fill="url(#hazeA)" />

      {/* Distant tree line */}
      {[0, 40, 80, 130, 175, 220, 270, 320, 370, 420, 470, 515].map((x, i) => {
        const h = 28 + (i % 3) * 12;
        return (
          <ellipse key={i} cx={x + 22} cy={192 - h / 2} rx={20} ry={h / 2} fill={i % 4 === 0 ? "#4a5c4e" : "#3e5044"} opacity="0.7" />
        );
      })}

      {/* Store facade */}
      <rect x="18" y="100" width="524" height="105" fill="#7a8088" />
      <rect x="18" y="97" width="524" height="7" fill="#666c74" />
      {/* Facade panels */}
      {[18, 100, 185, 270, 355, 440].map((x) => (
        <rect key={x} x={x} y="100" width="78" height="105" fill="rgba(0,0,0,.04)" />
      ))}
      {/* Store windows */}
      {[38, 116, 200, 280, 362, 446].map((x) => (
        <g key={x}>
          <rect x={x} y="118" width="52" height="36" fill="#c0ced8" rx="1" opacity="0.5" />
          <rect x={x} y="118" width="52" height="36" fill="none" stroke="#aabac6" strokeWidth="1" rx="1" />
        </g>
      ))}
      {/* Awning stripe */}
      <rect x="18" y="154" width="524" height="10" fill="#606870" />
      {/* Sign */}
      <rect x="168" y="72" width="224" height="28" fill="#686e76" />
      <text x="280" y="91" textAnchor="middle" fill="rgba(255,255,255,.06)" fontSize="14" fontFamily="sans-serif" fontWeight="900" letterSpacing="8">WALMART</text>

      {/* Asphalt */}
      <rect y="200" width="560" height="180" fill="url(#asphaltA)" />

      {/* Parking lines — converging perspective */}
      <g stroke="rgba(255,255,255,.38)" strokeWidth="1.5">
        <line x1="42" y1="380" x2="74" y2="204" />
        <line x1="134" y1="380" x2="150" y2="204" />
        <line x1="224" y1="380" x2="226" y2="204" />
        <line x1="314" y1="380" x2="302" y2="204" />
        <line x1="406" y1="380" x2="378" y2="204" />
        <line x1="498" y1="380" x2="454" y2="204" />
      </g>
      {/* Stop line */}
      <line x1="0" y1="340" x2="560" y2="340" stroke="rgba(255,255,255,.22)" strokeWidth="2" />

      {/* Parked cars far left & right (background) */}
      <rect x="16" y="218" width="58" height="36" rx="3" fill="#4a5060" opacity="0.6" />
      <rect x="486" y="220" width="60" height="34" rx="3" fill="#38404a" opacity="0.6" />

      {/* Ground shadow beneath subject truck */}
      <ellipse cx="280" cy="376" rx="118" ry="9" fill="rgba(0,0,0,.55)" />
    </svg>
  );
}

/* ─── IMAGE 4 FALLBACK: Cam B — Rear-facing road scene ──────────────── */

function RoadScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#607080" />
          <stop offset="55%" stopColor="#7a8e9e" />
          <stop offset="100%" stopColor="#9aaab8" />
        </linearGradient>
        <linearGradient id="roadB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282c32" />
          <stop offset="100%" stopColor="#1a1d20" />
        </linearGradient>
        <linearGradient id="roadEdgeB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20252a" />
          <stop offset="100%" stopColor="#14181c" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="560" height="195" fill="url(#skyB)" />

      {/* Treeline / suburbs on horizon */}
      {[0, 35, 75, 115, 160, 205, 255, 310, 360, 410, 460, 510].map((x, i) => {
        const h = 22 + (i % 4) * 10;
        return (
          <ellipse key={i} cx={x + 24} cy={190 - h / 2} rx={22} ry={h / 2} fill={i % 3 === 0 ? "#3e5240" : "#36483a"} opacity="0.65" />
        );
      })}

      {/* Road surface */}
      <path d="M 0,380 L 90,195 L 470,195 L 560,380 Z" fill="url(#roadB)" />
      {/* Road shoulders */}
      <path d="M 0,380 L 90,195 L 74,195 L 0,380 Z" fill="url(#roadEdgeB)" />
      <path d="M 560,380 L 470,195 L 486,195 L 560,380 Z" fill="url(#roadEdgeB)" />

      {/* Lane divider — yellow center dashes in perspective */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = 0.15 + i * 0.135;
        const x1 = 90 + (560 / 2 - 90) * t;
        const y1 = 195 + (380 - 195) * t;
        const x2 = 90 + (560 / 2 - 90) * (t + 0.08);
        const y2 = 195 + (380 - 195) * (t + 0.08);
        const sw = 1.5 + i * 0.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,210,60,.55)" strokeWidth={sw} />;
      })}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = 0.15 + i * 0.135;
        const x1 = 560 / 2 + (560 / 2 - 90) * t;
        const y1 = 195 + (380 - 195) * t;
        const x2 = 560 / 2 + (560 / 2 - 90) * (t + 0.08);
        const y2 = 195 + (380 - 195) * (t + 0.08);
        const sw = 1.5 + i * 0.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,210,60,.55)" strokeWidth={sw} />;
      })}

      {/* Road edge white lines */}
      <line x1="0" y1="380" x2="90" y2="195" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" />
      <line x1="560" y1="380" x2="470" y2="195" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" />

      {/* Distant vehicles (far background) */}
      <rect x="218" y="200" width="22" height="12" rx="2" fill="#3a4255" opacity="0.8" />
      <rect x="252" y="198" width="18" height="10" rx="2" fill="#303848" opacity="0.6" />
      <rect x="318" y="202" width="20" height="11" rx="2" fill="#3c4460" opacity="0.7" />

      {/* Ground shadow beneath subject car */}
      <ellipse cx="280" cy="376" rx="106" ry="8" fill="rgba(0,0,0,.5)" />
    </svg>
  );
}

/* ─── IMAGE 1 FALLBACK: Cam A — F-150 rear view ─────────────────────── */

function F150RearView() {
  return (
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      width="72%"
      height="60%"
      viewBox="0 0 480 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cab top */}
      <rect x="88" y="34" width="304" height="28" rx="4" fill="#c0c4c8" stroke="#7a8290" strokeWidth="1.5" />
      <rect x="96" y="38" width="288" height="20" rx="2" fill="#1a2530" opacity="0.85" />

      {/* Main body */}
      <rect x="68" y="56" width="344" height="154" rx="4" fill="#c4c8cc" stroke="#7a8290" strokeWidth="1.5" />

      {/* Tailgate panel */}
      <rect x="78" y="106" width="324" height="94" rx="3" fill="#b8bcc0" stroke="#7a8290" strokeWidth="1" />
      <rect x="92" y="116" width="296" height="74" rx="2" fill="#aeaeb2" />

      {/* FORD oval badge */}
      <ellipse cx="240" cy="150" rx="30" ry="17.5" fill="#002db3" />
      <ellipse cx="240" cy="150" rx="24" ry="13.5" fill="#003ecc" />
      <text x="240" y="155.5" textAnchor="middle" fill="white" fontSize="11.5" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700">Ford</text>

      {/* F-150 badge */}
      <text x="334" y="128" fill="rgba(255,255,255,.7)" fontSize="9" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.5">F-150</text>

      {/* Texas license plate */}
      <rect x="176" y="170" width="128" height="54" rx="3" fill="#f5f0e0" stroke="#c8c0a8" strokeWidth="1" />
      <rect x="176" y="170" width="128" height="13" rx="3" fill="#c0392b" />
      <rect x="176" y="178" width="128" height="5" fill="#c0392b" />
      <text x="240" y="181" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="sans-serif" fontWeight="800" letterSpacing="3.5">TEXAS</text>
      {/* Plate star decoration */}
      <text x="185" y="210" fill="#c0392b" fontSize="8" fontFamily="sans-serif" opacity="0.7">★</text>
      <text x="291" y="210" fill="#c0392b" fontSize="8" fontFamily="sans-serif" opacity="0.7">★</text>
      <text x="240" y="213" textAnchor="middle" fill="#1a1a1a" fontSize="20" fontFamily="monospace" fontWeight="800" letterSpacing="4">JLW 8931</text>

      {/* Left taillight cluster */}
      <rect x="70" y="60" width="32" height="68" rx="4" fill="#cc1122" opacity="0.92" />
      <rect x="70" y="60" width="32" height="68" rx="4" fill="none" stroke="#ff2233" strokeWidth="1" />
      <rect x="74" y="64" width="24" height="60" rx="3" fill="rgba(255,100,100,.28)" />
      {/* Brake light inner */}
      <rect x="76" y="66" width="18" height="30" rx="2" fill="rgba(255,180,180,.2)" />

      {/* Right taillight cluster */}
      <rect x="378" y="60" width="32" height="68" rx="4" fill="#cc1122" opacity="0.92" />
      <rect x="378" y="60" width="32" height="68" rx="4" fill="none" stroke="#ff2233" strokeWidth="1" />
      <rect x="382" y="64" width="24" height="60" rx="3" fill="rgba(255,100,100,.28)" />
      <rect x="386" y="66" width="18" height="30" rx="2" fill="rgba(255,180,180,.2)" />

      {/* Step bumper */}
      <rect x="68" y="206" width="344" height="16" rx="3" fill="#1e2226" />
      <rect x="80" y="208" width="320" height="6" rx="2" fill="#262a2e" />

      {/* Tow hitch */}
      <rect x="228" y="220" width="24" height="8" rx="2" fill="#2a2e32" />

      {/* Wheels */}
      <circle cx="130" cy="260" r="32" fill="#1a1a1a" />
      <circle cx="130" cy="260" r="23" fill="#242424" />
      <circle cx="130" cy="260" r="10" fill="#3a3a3a" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={130 + 12 * Math.cos((a * Math.PI) / 180)}
          y1={260 + 12 * Math.sin((a * Math.PI) / 180)}
          x2={130 + 21 * Math.cos((a * Math.PI) / 180)}
          y2={260 + 21 * Math.sin((a * Math.PI) / 180)}
          stroke="#4a4a4a" strokeWidth="3.5"
        />
      ))}
      <circle cx="350" cy="260" r="32" fill="#1a1a1a" />
      <circle cx="350" cy="260" r="23" fill="#242424" />
      <circle cx="350" cy="260" r="10" fill="#3a3a3a" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={350 + 12 * Math.cos((a * Math.PI) / 180)}
          y1={260 + 12 * Math.sin((a * Math.PI) / 180)}
          x2={350 + 21 * Math.cos((a * Math.PI) / 180)}
          y2={260 + 21 * Math.sin((a * Math.PI) / 180)}
          stroke="#4a4a4a" strokeWidth="3.5"
        />
      ))}
    </svg>
  );
}

/* ─── IMAGE 4 FALLBACK: Cam B — Camry front view (rear-facing camera) ── */

function CamryFrontView() {
  return (
    <svg
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      width="66%"
      height="56%"
      viewBox="0 0 480 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roof */}
      <rect x="108" y="46" width="264" height="30" rx="12" fill="#2a5e96" />

      {/* A-pillars */}
      <path d="M 108,76 L 76,130 L 108,130 Z" fill="#234e80" />
      <path d="M 372,76 L 404,130 L 372,130 Z" fill="#234e80" />

      {/* Windshield */}
      <path d="M 112,76 Q 240,52 368,76 L 368,130 Q 240,118 112,130 Z" fill="#1a2c3e" opacity="0.88" />
      {/* Windshield glare */}
      <path d="M 130,80 Q 200,62 300,78 L 310,100 Q 220,86 140,104 Z" fill="rgba(255,255,255,.06)" />

      {/* Hood */}
      <path d="M 58,160 Q 68,110 240,94 Q 412,110 422,160 Z" fill="#2e6aaa" />
      {/* Hood center crease */}
      <line x1="240" y1="94" x2="240" y2="160" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />

      {/* Upper grille surround */}
      <path d="M 74,140 Q 84,128 240,122 Q 396,128 406,140 L 406,168 Q 396,156 240,150 Q 84,156 74,168 Z" fill="#1a2030" />

      {/* Main grille */}
      <path d="M 110,158 Q 240,148 370,158 L 365,195 Q 240,188 115,195 Z" fill="#14181e" />
      {/* Grille mesh lines */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M 114,${163 + i * 11} Q 240,${157 + i * 11} 366,${163 + i * 11}`}
          fill="none" stroke="#252c38" strokeWidth="1.5"
        />
      ))}
      {[128, 160, 192, 224, 256, 288, 320, 352].map((x) => (
        <line key={x} x1={x} y1="158" x2={x} y2="195" stroke="#252c38" strokeWidth="1.5" />
      ))}

      {/* Toyota badge (oval) */}
      <ellipse cx="240" cy="178" rx="20" ry="13" fill="#d0d0d0" stroke="#aaa" strokeWidth="1" />
      <ellipse cx="240" cy="175" rx="11" ry="8" fill="none" stroke="#888" strokeWidth="2" />
      <ellipse cx="240" cy="175" rx="6" ry="8" fill="none" stroke="#888" strokeWidth="2" />
      <line x1="229" y1="175" x2="251" y2="175" stroke="#888" strokeWidth="2" />

      {/* Front bumper lower */}
      <path d="M 58,168 Q 68,206 240,216 Q 412,206 422,168 L 422,200 Q 410,234 240,246 Q 70,234 58,200 Z" fill="#224068" />

      {/* Left headlight */}
      <path d="M 58,130 Q 74,116 110,122 L 108,160 Q 74,162 58,148 Z" fill="#b0bcc8" />
      <ellipse cx="83" cy="140" rx="20" ry="15" fill="#e8f2fc" opacity="0.95" />
      <ellipse cx="83" cy="140" rx="15" ry="11" fill="rgba(255,252,220,.98)" />
      <ellipse cx="83" cy="140" rx="7" ry="6" fill="white" />
      {/* Headlight lens glare */}
      <ellipse cx="78" cy="135" rx="4" ry="3" fill="white" opacity="0.5" />
      {/* Glow */}
      <ellipse cx="83" cy="140" rx="34" ry="26" fill="rgba(255,248,180,.1)" />

      {/* Right headlight */}
      <path d="M 502,130 Q 486,116 370,122 L 372,160 Q 406,162 422,148 Z" fill="#b0bcc8" />
      <ellipse cx="397" cy="140" rx="20" ry="15" fill="#e8f2fc" opacity="0.95" />
      <ellipse cx="397" cy="140" rx="15" ry="11" fill="rgba(255,252,220,.98)" />
      <ellipse cx="397" cy="140" rx="7" ry="6" fill="white" />
      <ellipse cx="402" cy="135" rx="4" ry="3" fill="white" opacity="0.5" />
      <ellipse cx="397" cy="140" rx="34" ry="26" fill="rgba(255,248,180,.1)" />

      {/* DRL strips */}
      <path d="M 62,132 Q 74,122 106,128" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 418,132 Q 406,122 374,128" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Fog lights */}
      <ellipse cx="116" cy="210" rx="11" ry="8" fill="rgba(240,240,160,.55)" />
      <ellipse cx="364" cy="210" rx="11" ry="8" fill="rgba(240,240,160,.55)" />

      {/* Front license plate — California */}
      <rect x="182" y="198" width="116" height="40" rx="2" fill="white" stroke="#c8c8c8" strokeWidth="1" />
      <rect x="182" y="198" width="116" height="9" rx="2" fill="#1e4dad" />
      <rect x="182" y="204" width="116" height="3" fill="#1e4dad" />
      <text x="240" y="205" textAnchor="middle" fill="rgba(255,255,255,.9)" fontSize="6.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.5">CALIFORNIA</text>
      <text x="240" y="229" textAnchor="middle" fill="#111" fontSize="17" fontFamily="monospace" fontWeight="800" letterSpacing="3">8KAM 415</text>

      {/* Body sides + fenders */}
      <path d="M 58,150 L 58,270 Q 58,285 72,285 L 126,285 L 126,270 Q 84,264 68,215 L 68,160 Z" fill="#2a5e96" />
      <path d="M 422,150 L 422,270 Q 422,285 408,285 L 354,285 L 354,270 Q 396,264 412,215 L 412,160 Z" fill="#2a5e96" />

      {/* Wheel arches */}
      <path d="M 68,268 Q 96,235 130,268" fill="#1e4a78" stroke="#163a64" strokeWidth="1" />
      <path d="M 412,268 Q 384,235 350,268" fill="#1e4a78" stroke="#163a64" strokeWidth="1" />

      {/* Wheels — front view (circular ellipses) */}
      <ellipse cx="100" cy="272" rx="30" ry="14" fill="#1a1a1a" />
      <ellipse cx="100" cy="272" rx="22" ry="10" fill="#242424" />
      <ellipse cx="100" cy="272" rx="9" ry="4.5" fill="#343434" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={100 + 11 * Math.cos((a * Math.PI) / 180)}
          y1={272 + 5.5 * Math.sin((a * Math.PI) / 180)}
          x2={100 + 19 * Math.cos((a * Math.PI) / 180)}
          y2={272 + 9.5 * Math.sin((a * Math.PI) / 180)}
          stroke="#404040" strokeWidth="2.5"
        />
      ))}
      <ellipse cx="380" cy="272" rx="30" ry="14" fill="#1a1a1a" />
      <ellipse cx="380" cy="272" rx="22" ry="10" fill="#242424" />
      <ellipse cx="380" cy="272" rx="9" ry="4.5" fill="#343434" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={380 + 11 * Math.cos((a * Math.PI) / 180)}
          y1={272 + 5.5 * Math.sin((a * Math.PI) / 180)}
          x2={380 + 19 * Math.cos((a * Math.PI) / 180)}
          y2={272 + 9.5 * Math.sin((a * Math.PI) / 180)}
          stroke="#404040" strokeWidth="2.5"
        />
      ))}
    </svg>
  );
}
