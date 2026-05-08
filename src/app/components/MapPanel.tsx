import { motion } from "motion/react";

export function MapPanel() {
  return (
    <div className="h-[280px] relative overflow-hidden bg-[var(--bg-1)]">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,229,212,.04) 0%, var(--bg-0) 70%)",
        }}
      />

      {/* SVG Map */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 280">
        {/* Grid pattern */}
        <defs>
          <pattern
            id="grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.5"
              opacity="0.25"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Minor streets (1px) */}
        <line x1="120" y1="0" x2="120" y2="280" stroke="var(--line)" strokeWidth="1" />
        <line x1="360" y1="0" x2="360" y2="280" stroke="var(--line)" strokeWidth="1" />
        <line x1="0" y1="70" x2="480" y2="70" stroke="var(--line)" strokeWidth="1" />
        <line x1="0" y1="210" x2="480" y2="210" stroke="var(--line)" strokeWidth="1" />

        {/* Major streets (2px) */}
        <line x1="240" y1="0" x2="240" y2="280" stroke="var(--line-2)" strokeWidth="2" />
        <line x1="0" y1="140" x2="480" y2="140" stroke="var(--line-2)" strokeWidth="2" />

        {/* Diagonal road */}
        <line
          x1="440"
          y1="20"
          x2="40"
          y2="260"
          stroke="var(--line-2)"
          strokeWidth="1.5"
        />

        {/* Breadcrumb trail - recent route */}
        <path
          d="M 180,200 Q 200,170 220,150 T 240,140 T 260,130 T 280,125"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="2,3"
          opacity="0.3"
        />

        {/* Nearby unit markers */}
        <g transform="translate(160, 100)">
          <circle cx="0" cy="0" r="6" fill="rgba(0,229,212,.15)" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
          <circle cx="0" cy="0" r="3" fill="var(--accent)" opacity="0.6" />
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fill="var(--text-2)"
            fontSize="9"
            fontFamily="Geist Mono, monospace"
          >
            U-04
          </text>
        </g>

        <g transform="translate(340, 190)">
          <circle cx="0" cy="0" r="6" fill="rgba(0,229,212,.15)" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
          <circle cx="0" cy="0" r="3" fill="var(--accent)" opacity="0.6" />
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fill="var(--text-2)"
            fontSize="9"
            fontFamily="Geist Mono, monospace"
          >
            U-07
          </text>
        </g>

        {/* BOLO marker */}
        <g transform="translate(380, 80)">
          <circle cx="0" cy="0" r="6" fill="rgba(255,170,0,.15)" stroke="var(--amber)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="var(--amber)" />
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fill="var(--amber)"
            fontSize="9"
            fontFamily="Geist Mono, monospace"
            fontWeight="600"
          >
            BOLO
          </text>
        </g>

        {/* Current unit marker (center) */}
        <g transform="translate(240, 140)">
          {/* Expanding ring animation */}
          <motion.circle
            cx="0"
            cy="0"
            r="8"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            initial={{ r: 8, opacity: 0.8 }}
            animate={{ r: 30, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Outer circle */}
          <circle
            cx="0"
            cy="0"
            r="14"
            fill="rgba(0,229,212,.2)"
            stroke="var(--accent)"
            strokeWidth="2"
          />

          {/* Inner circle */}
          <circle cx="0" cy="0" r="6" fill="var(--accent)" />

          {/* Direction pointer (pointing north) */}
          <polygon
            points="0,-14 -4,-8 4,-8"
            fill="white"
          />
        </g>
      </svg>

      {/* Top-left overlay - Unit location */}
      <div
        className="absolute top-2 left-3 px-3 py-2 rounded"
        style={{
          background: "rgba(5,7,9,.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div className="font-mono uppercase text-[9px] text-[var(--text-3)] mb-1">
          UNIT LOCATION
        </div>
        <div className="font-mono text-[12px] font-bold text-[var(--text-0)] mb-0.5">
          UNIT 01 · PATROL
        </div>
        <div className="font-mono text-[10px] text-[var(--text-2)]">
          32.9226° N · 97.0897° W
        </div>
      </div>

      {/* Top-right overlay - RTK lock */}
      <div
        className="absolute top-2 right-3 px-3 py-2 rounded"
        style={{
          background: "rgba(5,7,9,.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div className="font-mono uppercase text-[9px] text-[var(--text-3)] mb-1 text-right">
          RTK LOCK
        </div>
        <div className="font-mono text-[12px] font-bold text-[var(--good)]">
          FIXED · ±0.02m
        </div>
      </div>
    </div>
  );
}
