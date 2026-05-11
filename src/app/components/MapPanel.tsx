import { motion } from "motion/react";

// Street break points
const V = [0, 60, 120, 180, 240, 300, 360, 420, 480]; // vertical street positions
const H = [0, 35, 70, 105, 140, 175, 210, 245, 280];   // horizontal street positions
const SW = 1.8; // half-gutter for block inset

function blockFill(ci: number, ri: number): string {
  if (ci <= 1 && ri <= 2) return "#0d1d16"; // park — NW corner
  if (ri >= 7)             return "#0c1322"; // water — south strip
  return "#0b1117";                          // standard city block
}

function vStroke(x: number) {
  if (x === 240) return { color: "#243554", w: 4 };
  if (x === 120 || x === 360) return { color: "#1b2a3e", w: 2 };
  return { color: "#131d2c", w: 1.5 };
}
function hStroke(y: number) {
  if (y === 140) return { color: "#243554", w: 4 };
  if (y === 70 || y === 210) return { color: "#1b2a3e", w: 2 };
  return { color: "#131d2c", w: 1.5 };
}

export function MapPanel() {
  return (
    <div className="h-[280px] relative overflow-hidden" style={{ background: "#050709" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 280">

        {/* ── City block fills ─────────────────────────────────────── */}
        {V.slice(0, -1).map((x, ci) =>
          H.slice(0, -1).map((y, ri) => (
            <rect
              key={`b${ci}-${ri}`}
              x={x + SW} y={y + SW}
              width={V[ci + 1] - x - SW * 2}
              height={H[ri + 1] - y - SW * 2}
              fill={blockFill(ci, ri)}
            />
          ))
        )}

        {/* Park tree texture */}
        {[18, 42, 68, 96, 20, 55, 82].map((x, i) => {
          const y = [22, 55, 80, 24, 60, 38, 90][i];
          return (
            <g key={`tree${i}`}>
              <circle cx={x} cy={y} r={4.5} fill="#102218" opacity="0.6" />
              <circle cx={x} cy={y} r={2.5} fill="#16301e" opacity="0.5" />
            </g>
          );
        })}

        {/* Water shimmer */}
        <line x1="0" y1="250" x2="480" y2="250" stroke="#16243a" strokeWidth="1.5" opacity="0.7" />
        <line x1="0" y1="258" x2="480" y2="258" stroke="#16243a" strokeWidth="1" opacity="0.4" />

        {/* ── Street network ────────────────────────────────────────── */}
        {V.slice(1, -1).map(x => {
          const s = vStroke(x);
          return <line key={`v${x}`} x1={x} y1={0} x2={x} y2={280} stroke={s.color} strokeWidth={s.w} />;
        })}
        {H.slice(1, -1).map(y => {
          const s = hStroke(y);
          return <line key={`h${y}`} x1={0} y1={y} x2={480} y2={y} stroke={s.color} strokeWidth={s.w} />;
        })}

        {/* I-35 diagonal */}
        <line x1="438" y1="0" x2="46" y2="280" stroke="#2b3e5e" strokeWidth="5" />
        <line x1="438" y1="0" x2="46" y2="280" stroke="rgba(255,255,255,.04)" strokeWidth="1.5" strokeDasharray="7,9" />

        {/* Arterial center dashes */}
        <line x1="240" y1="0" x2="240" y2="280" stroke="rgba(255,255,255,.04)" strokeWidth="1" strokeDasharray="8,11" />
        <line x1="0" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,.04)" strokeWidth="1" strokeDasharray="8,11" />

        {/* ── Hit location marker ───────────────────────────────────── */}
        {/* Pulse ring */}
        <motion.circle
          cx="294" cy="116" r="10"
          fill="none" stroke="var(--hit)" strokeWidth="1.5"
          animate={{ r: [10, 30], opacity: [0.75, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Second offset ring */}
        <motion.circle
          cx="294" cy="116" r="10"
          fill="none" stroke="var(--hit)" strokeWidth="1"
          animate={{ r: [10, 30], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        />
        <circle cx="294" cy="116" r="5" fill="var(--hit)" opacity="0.92" />
        <circle cx="294" cy="116" r="2.5" fill="white" opacity="0.8" />
        {/* Hit label */}
        <rect x="300" y="103" width="54" height="16" rx="2" fill="rgba(255,51,85,.15)" />
        <text x="304" y="115" fill="var(--hit)" fontSize="8" fontFamily="monospace" fontWeight="700" opacity="0.95">JLW 8931</text>

        {/* ── Route breadcrumb (unit → hit) ─────────────────────────── */}
        <path
          d="M 240,140 C 258,136 272,126 294,116"
          fill="none" stroke="var(--hit)" strokeWidth="1.5"
          strokeDasharray="3,4" opacity="0.5"
        />

        {/* ── Adjacent unit markers ─────────────────────────────────── */}
        {([
          { cx: 162, cy: 96,  label: "U-04" },
          { cx: 338, cy: 190, label: "U-07" },
        ] as const).map(({ cx, cy, label }) => (
          <g key={label} transform={`translate(${cx},${cy})`}>
            <circle cx="0" cy="0" r="5.5" fill="rgba(0,229,212,.1)" stroke="var(--accent)" strokeWidth="1" />
            <circle cx="0" cy="0" r="2.5" fill="var(--accent)" opacity="0.7" />
            <text x="0" y="-10" textAnchor="middle" fill="var(--text-3)" fontSize="8" fontFamily="Geist Mono, monospace">{label}</text>
          </g>
        ))}

        {/* BOLO marker */}
        <g transform="translate(384,78)">
          <circle cx="0" cy="0" r="5.5" fill="rgba(255,170,0,.1)" stroke="var(--amber)" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="var(--amber)" />
          <text x="0" y="-10" textAnchor="middle" fill="var(--amber)" fontSize="8" fontFamily="Geist Mono, monospace" fontWeight="600">WATCH</text>
        </g>

        {/* ── Own unit (center) ─────────────────────────────────────── */}
        <g transform="translate(240,140)">
          <motion.circle
            cx="0" cy="0" r="10"
            fill="none" stroke="var(--accent)" strokeWidth="2"
            initial={{ r: 10, opacity: 0.8 }}
            animate={{ r: 32, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          <circle cx="0" cy="0" r="14" fill="rgba(0,229,212,.16)" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="var(--accent)" />
          {/* Direction arrow */}
          <polygon points="0,-14 -4,-7 4,-7" fill="white" opacity="0.9" />
        </g>
      </svg>

      {/* Unit location pill */}
      <div
        className="absolute top-2 left-3 px-3 py-2"
        style={{ background: "rgba(5,7,9,.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.07)" }}
      >
        <div className="font-mono uppercase text-[9px] text-[var(--text-3)] mb-1 leading-none">UNIT LOCATION</div>
        <div className="font-mono text-[12px] font-bold text-[var(--text-0)] mb-0.5 leading-none">UNIT 01 · PATROL</div>
        <div className="font-mono text-[10px] text-[var(--text-2)] leading-none">32.9226° N · 97.0897° W</div>
      </div>

      {/* Hit location pill — replaces generic RTK, contextual to the active hit */}
      <div
        className="absolute top-2 right-3 px-3 py-2"
        style={{ background: "rgba(5,7,9,.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,51,85,.22)" }}
      >
        <div className="font-mono uppercase text-[9px] mb-1 leading-none" style={{ color: "var(--hit)" }}>HIT LOCATION</div>
        <div className="font-mono text-[11px] font-bold text-[var(--text-0)] mb-0.5 leading-none">N. Main &amp; W. Oak</div>
        <div className="font-mono text-[9px] text-[var(--text-3)] leading-none">RTK FIXED · ±0.02 m</div>
      </div>
    </div>
  );
}
