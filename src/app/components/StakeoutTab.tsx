import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";
const STATES = ["TX", "TX", "TX", "OK", "NM", "CA", "LA"];

function randomPlate() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const N = "0123456789";
  return `${L[~~(Math.random()*26)]}${L[~~(Math.random()*26)]}${L[~~(Math.random()*26)]} ${N[~~(Math.random()*10)]}${N[~~(Math.random()*10)]}${N[~~(Math.random()*10)]}${N[~~(Math.random()*10)]}`;
}

interface Read {
  id: string; time: string; plate: string; state: string; camera: "A" | "B";
}

export function StakeoutTab() {
  const [active, setActive] = useState(false);
  const [reads, setReads] = useState<Read[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [radius, setRadius] = useState("0.3");

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setReads((prev) => [{
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        plate: randomPlate(),
        state: STATES[~~(Math.random() * STATES.length)],
        camera: Math.random() > 0.5 ? "A" : "B",
      }, ...prev].slice(0, 60));
    }, 2200);
    return () => clearInterval(t);
  }, [active]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (s: number) => `${pad(~~(s / 3600))}:${pad(~~((s % 3600) / 60))}:${pad(s % 60)}`;

  const handleToggle = () => {
    if (active) { setReads([]); setElapsed(0); }
    setActive(!active);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-0)" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)", flexShrink: 0 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-0)" }}>
          Stakeout Mode · Fixed ALPR
        </span>
      </div>

      {/* Activate panel */}
      <div style={{ padding: 24, borderBottom: "1px solid var(--line)", background: active ? "rgba(0,229,212,.03)" : "var(--bg-1)", flexShrink: 0, transition: "background .3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <motion.button
            onClick={handleToggle}
            whileHover={{ filter: "brightness(1.1)" }}
            style={{
              padding: "13px 28px",
              background: active ? "var(--hit)" : "var(--accent)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: MONO, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: active ? "white" : "var(--bg-0)",
              boxShadow: active ? "0 4px 20px rgba(255,51,85,.3)" : "0 4px 20px rgba(0,229,212,.2)",
              flexShrink: 0,
            }}
          >
            <MapPin size={16} />
            {active ? "Stop Stakeout" : "I'm Parked · Activate"}
          </motion.button>

          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ display: "flex", gap: 28 }}
              >
                <Stat label="Elapsed" value={fmt(elapsed)} color="var(--accent)" />
                <Stat label="Reads" value={reads.length.toString()} color="var(--text-0)" />
                <Stat label="Cameras" value="A + B" color="var(--text-0)" />
                <Stat label="GPS" value="32.9226° N" mono color="var(--text-2)" />
              </motion.div>
            ) : (
              <motion.div
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}
              >
                Parks the unit and runs both cameras as a fixed ALPR.<br />
                All reads are GPS-tagged and logged to shift record.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {active && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}
          >
            <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0 }}>
              Geofence radius: <span style={{ color: "var(--text-0)" }}>{radius} mi</span>
            </span>
            <input
              type="range" min="0.1" max="2" step="0.1" value={radius}
              onChange={(e) => setRadius(e.target.value)}
              style={{ width: 180, accentColor: "var(--accent)" }}
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--good)" }} />
              <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--good)", letterSpacing: "0.1em", textTransform: "uppercase" }}>RECORDING</span>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Reads table */}
      {active ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 48px 56px", gap: 12, padding: "8px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)", flexShrink: 0 }}>
            {["TIME", "PLATE", "ST", "CAM"].map((h) => (
              <div key={h} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>{h}</div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="scrollbar-thin">
            <AnimatePresence initial={false}>
              {reads.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, backgroundColor: "rgba(0,229,212,.12)" }}
                  animate={{ opacity: 1, backgroundColor: "transparent" }}
                  transition={{ duration: 0.8 }}
                  style={{ display: "grid", gridTemplateColumns: "80px 1fr 48px 56px", gap: 12, padding: "10px 24px", borderBottom: "1px solid var(--line)" }}
                >
                  <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-2)" }}>{r.time}</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "var(--text-0)" }}>{r.plate}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-3)" }}>{r.state}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--accent)" }}>CAM {r.camera}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            {reads.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, fontFamily: MONO, fontSize: 11, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Watching for plates…
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <MapPin size={36} style={{ color: "var(--text-3)", opacity: 0.3 }} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>
            Tap "I'm Parked" to begin fixed ALPR
          </span>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color, mono }: { label: string; value: string; color?: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ fontFamily: mono ? MONO : undefined, fontSize: 14, fontWeight: 700, color: color || "var(--text-0)" }}>{value}</div>
    </div>
  );
}
