import { motion } from "motion/react";

const MONO = "'Geist Mono', 'Monaco', monospace";

interface Bolo {
  id: number;
  priority: "HIGH" | "MED" | "LOW";
  plate?: string;
  state?: string;
  vehicle: string;
  reason: string;
  area: string;
  expiry: string;
  source: string;
  timestamp: string;
}

const BOLO_DATA: Bolo[] = [
  {
    id: 1,
    priority: "HIGH",
    plate: "RTX5521",
    state: "TX",
    vehicle: "2019 Black Chevrolet Tahoe · Tinted windows",
    reason: "ARMED ROBBERY SUSPECT — Approach with extreme caution",
    area: "N. Main & I-35 corridor · Within 2mi",
    expiry: "16:00",
    source: "Dispatch · Unit 07",
    timestamp: "14:15:00",
  },
  {
    id: 2,
    priority: "MED",
    vehicle: "Late-model silver SUV · Unknown plate",
    reason: "HIT & RUN — School zone. Front bumper damage, cracked headlight R side.",
    area: "Waverly Elementary radius · 1mi",
    expiry: "EOD",
    source: "CAD #2026-48821",
    timestamp: "13:40:17",
  },
  {
    id: 3,
    priority: "MED",
    plate: "MXP3389",
    state: "NM",
    vehicle: "2021 White Toyota Highlander",
    reason: "MISSING JUVENILE · 14yo, last seen on foot near vehicle",
    area: "Countywide — check school zones",
    expiry: "UNTIL NOTICE",
    source: "NCIC · Missing Persons",
    timestamp: "11:22:44",
  },
  {
    id: 4,
    priority: "LOW",
    plate: "BXC8801",
    state: "TX",
    vehicle: "2017 Blue Ford Explorer",
    reason: "PAROLE VIOLATION — Curfew check request from TDCJ",
    area: "South district",
    expiry: "22:00",
    source: "TDCJ Parole Division",
    timestamp: "09:05:12",
  },
];

export function BoloTab() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-0)" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-1)" }}>BOLOs & Dispatch</span>
          <span style={{ background: "rgba(255,170,0,.1)", border: "1px solid rgba(255,170,0,.3)", color: "var(--amber)", fontFamily: MONO, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
            {BOLO_DATA.length} ACTIVE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--good)" }}
          />
          <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>CAD LIVE</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }} className="scrollbar-thin">
        {BOLO_DATA.map((bolo) => <BoloCard key={bolo.id} bolo={bolo} />)}
      </div>
    </div>
  );
}

function BoloCard({ bolo }: { bolo: Bolo }) {
  const pColor = bolo.priority === "HIGH" ? "var(--hit)" : bolo.priority === "MED" ? "var(--amber)" : "var(--text-2)";
  const pBg    = bolo.priority === "HIGH" ? "rgba(255,51,85,.1)" : bolo.priority === "MED" ? "rgba(255,170,0,.1)" : "var(--bg-3)";
  const expiryUrgent = !["EOD", "UNTIL NOTICE"].includes(bolo.expiry);

  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `3px solid ${pColor}`, background: "var(--bg-1)", padding: 16 }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 3, background: pBg, color: pColor, border: `1px solid ${pColor}40`, flexShrink: 0 }}>
          {bolo.priority}
        </span>
        <div style={{ flex: 1 }}>
          {bolo.plate ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: "var(--text-0)" }}>{bolo.plate}</span>
              {bolo.state && <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-2)" }}>· {bolo.state}</span>}
            </div>
          ) : (
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 3 }}>[PLATE UNKNOWN]</div>
          )}
          <div style={{ fontSize: 12, color: "var(--text-1)" }}>{bolo.vehicle}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-3)", flexShrink: 0 }}>{bolo.timestamp}</div>
      </div>

      {/* Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {([
          ["Reason",  bolo.reason,  "var(--text-0)"],
          ["Area",    bolo.area,    "var(--text-1)"],
          ["Expires", bolo.expiry,  expiryUrgent ? "var(--amber)" : "var(--text-2)"],
          ["Source",  bolo.source,  "var(--text-2)"],
        ] as [string, string, string][]).map(([label, value, color]) => (
          <div key={label}>
            <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color, lineHeight: 1.4 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
