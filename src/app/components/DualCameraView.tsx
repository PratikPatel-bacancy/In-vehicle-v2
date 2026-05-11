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
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-0)" }}>
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
                  <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-0)" }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type FeedEntry = { src: string; plate: string; state: string; roi: { left: string; bottom: string; width: string; height: string } };

const CAM_A_FEED: FeedEntry = {
  src: "/cameras/cam-a-f150.png", plate: "JLW8931", state: "TX",
  roi: { left: "38%", bottom: "26%", width: "23%", height: "9%" },
};

const CAM_B_FEEDS: FeedEntry[] = [
  { src: "/cameras/cam-b-camry.png",             plate: "8SAM415", state: "CA", roi: { left: "36%", bottom: "22%", width: "26%", height: "9%" } },
  { src: "/cameras/cam-camry-blue-sunset.jpeg",  plate: "8SAM415", state: "CA", roi: { left: "35%", bottom: "30%", width: "26%", height: "9%" } },
  { src: "/cameras/cam-camry-blue-street.jpeg",  plate: "8SAM415", state: "CA", roi: { left: "36%", bottom: "27%", width: "25%", height: "8%" } },
  { src: "/cameras/cam-honda-accord-a.jpeg",     plate: "4TRK209", state: "CA", roi: { left: "35%", bottom: "28%", width: "28%", height: "9%" } },
  { src: "/cameras/cam-honda-accord-b.jpeg",     plate: "4TRK209", state: "CA", roi: { left: "34%", bottom: "26%", width: "30%", height: "9%" } },
  { src: "/cameras/cam-ford-fusion-a.jpeg",      plate: "1NYC732", state: "CA", roi: { left: "35%", bottom: "28%", width: "28%", height: "9%" } },
  { src: "/cameras/cam-ford-fusion-b.jpeg",      plate: "1NYC732", state: "CA", roi: { left: "34%", bottom: "26%", width: "30%", height: "10%" } },
  { src: "/cameras/cam-ford-fusion-c.jpeg",      plate: "1NYC732", state: "CA", roi: { left: "28%", bottom: "22%", width: "26%", height: "8%" } },
  { src: "/cameras/cam-disabled.png",            plate: "G739KL",  state: "FL", roi: { left: "35%", bottom: "24%", width: "28%", height: "9%" } },
];

function CameraTileInner({ cameraId, isHit }: { cameraId: "A" | "B"; isHit: boolean }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [camBIdx, setCamBIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cam B cycles between the two rear images every 5s to simulate live feed
  useEffect(() => {
    if (cameraId !== "B") return;
    const t = setInterval(() => setCamBIdx((i) => (i + 1) % CAM_B_FEEDS.length), 5000);
    return () => clearInterval(t);
  }, [cameraId]);

  const feed = cameraId === "A" ? CAM_A_FEED : CAM_B_FEEDS[camBIdx];

  const roiColor = isHit ? "var(--hit)" : "var(--accent)";
  const roiGlow  = isHit ? "var(--hit-glow)" : "var(--accent-glow)";
  const label    = cameraId === "A" ? "CAM A · FRONT" : "CAM B · REAR";

  const roi = feed.roi;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Real camera image */}
      <motion.img
        key={feed.src}
        src={feed.src}
        alt={`Camera ${cameraId} feed`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Subtle dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* ALPR scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          top: `${scanProgress}%`,
          background: `linear-gradient(to right, transparent, ${roiColor}, transparent)`,
        }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Plate ROI box */}
      <motion.div
        className="absolute border-2"
        style={{
          left: roi.left,
          bottom: roi.bottom,
          width: roi.width,
          height: roi.height,
          borderColor: roiColor,
          boxShadow: `0 0 12px ${roiGlow}`,
        }}
        animate={isHit ? { boxShadow: [`0 0 12px ${roiGlow}`, `0 0 28px ${roiGlow}`, `0 0 12px ${roiGlow}`] } : {}}
        transition={isHit ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
      />

      {/* Camera label */}
      <div className="absolute top-3 left-3 px-2.5 py-1.5 flex items-center gap-2" style={{ background: "rgba(5,7,9,.78)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.1)" }}>
        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: isHit ? "var(--hit)" : "var(--accent)" }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
        <span className="font-mono uppercase text-[10px] tracking-[.08em] text-[var(--text-0)]">{label}</span>
      </div>

      {/* Bottom plate badge */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="px-3 py-1.5" style={{ background: "rgba(5,7,9,.78)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.1)" }}>
          <span className="font-mono text-[12px] font-semibold tracking-[.04em]" style={{ color: isHit ? "var(--hit)" : "var(--accent)" }}>
            {feed.plate.replace(" ", "")}{isHit && " · HIT"}
          </span>
        </div>
        <div className="px-2 py-1" style={{ background: "rgba(5,7,9,.78)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.08)" }}>
          <span className="font-mono text-[10px] text-[var(--text-2)]">{feed.state}</span>
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
          <Maximize2 size={12} className="text-[var(--text-0)]" />
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent)]/30 transition-all pointer-events-none" />
    </div>
  );
}

