import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";

type HitStatus = "pending" | "confirmed" | "dismissed" | "wrong_state";
type SortBy = "time" | "priority" | "disposition";

interface SafetyFlag { label: string; variant: "hit" | "amber" | "accent" }

interface Hit {
  id: number;
  time: string;
  plate: string;
  state: string;
  vehicle: string;
  camera: "A" | "B";
  reason: string;
  priority: "HIGH" | "MED" | "LOW";
  status: HitStatus;
  safetyFlags: SafetyFlag[];
}

const HITS_DATA: Hit[] = [
  {
    id: 1, time: "14:23:45", plate: "JLW8931", state: "TX", vehicle: "Silver Ford F-150",
    camera: "A", reason: "STOLEN VEHICLE", priority: "HIGH", status: "pending",
    safetyFlags: [
      { label: "ARMED & DANGEROUS", variant: "hit" },
      { label: "PRIOR · RESISTING", variant: "amber" },
      { label: "DASH-CAM ON", variant: "accent" },
    ],
  },
  {
    id: 2, time: "12:44:18", plate: "ABC1234", state: "TX", vehicle: "Black GMC Sierra",
    camera: "B", reason: "WANTED FELONY", priority: "HIGH", status: "confirmed",
    safetyFlags: [
      { label: "VIOLENT FELONY", variant: "hit" },
      { label: "DASH-CAM ON", variant: "accent" },
    ],
  },
  {
    id: 3, time: "11:15:33", plate: "XYZ9876", state: "OK", vehicle: "Red Dodge Challenger",
    camera: "A", reason: "STOLEN VEHICLE", priority: "MED", status: "wrong_state",
    safetyFlags: [
      { label: "DASH-CAM ON", variant: "accent" },
    ],
  },
  {
    id: 4, time: "09:52:07", plate: "DEF5678", state: "TX", vehicle: "White Toyota Tacoma",
    camera: "B", reason: "WATCH · FELONY STOP", priority: "MED", status: "dismissed",
    safetyFlags: [
      { label: "PRIOR RECORD", variant: "amber" },
      { label: "DASH-CAM ON", variant: "accent" },
    ],
  },
];

interface HitsTabProps {
  onTriggerHit?: () => void;
}

export function HitsTab({ onTriggerHit }: HitsTabProps) {
  const [sortBy, setSortBy] = useState<SortBy>("time");
  const [expanded, setExpanded] = useState<number | null>(1);
  const [statuses, setStatuses] = useState<Record<number, HitStatus>>(
    Object.fromEntries(HITS_DATA.map((h) => [h.id, h.status]))
  );

  const sorted = [...HITS_DATA].sort((a, b) => {
    if (sortBy === "priority") {
      return ({ HIGH: 0, MED: 1, LOW: 2 }[a.priority]) - ({ HIGH: 0, MED: 1, LOW: 2 }[b.priority]);
    }
    if (sortBy === "disposition") {
      return ({ pending: 0, confirmed: 1, wrong_state: 2, dismissed: 3 }[a.status]) - ({ pending: 0, confirmed: 1, wrong_state: 2, dismissed: 3 }[b.status]);
    }
    return b.time.localeCompare(a.time);
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-0)" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-0)" }}>Hotlist Hits</span>
          <span style={{ background: "rgba(255,51,85,.1)", border: "1px solid rgba(255,51,85,.3)", color: "var(--hit)", fontFamily: MONO, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
            {HITS_DATA.length} HITS · SHIFT
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", paddingRight: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Sort:</span>
          {(["time", "priority", "disposition"] as SortBy[]).map((s) => (
            <button key={s} onClick={() => setSortBy(s)} style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", cursor: "pointer", background: sortBy === s ? "var(--bg-3)" : "transparent", border: sortBy === s ? "1px solid var(--line-2)" : "1px solid transparent", color: sortBy === s ? "var(--accent)" : "var(--text-3)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }} className="scrollbar-thin">
        {sorted.map((hit) => (
          <HitCard
            key={hit.id}
            hit={hit}
            status={statuses[hit.id]}
            expanded={expanded === hit.id}
            onExpand={() => setExpanded(expanded === hit.id ? null : hit.id)}
            onTriggerHit={hit.id === 1 ? onTriggerHit : undefined}
            onStatusChange={(s) => setStatuses((prev) => ({ ...prev, [hit.id]: s }))}
          />
        ))}
      </div>
    </div>
  );
}

function HitCard({ hit, status, expanded, onExpand, onTriggerHit, onStatusChange }: {
  hit: Hit; status: HitStatus; expanded: boolean;
  onExpand: () => void; onTriggerHit?: () => void; onStatusChange: (s: HitStatus) => void;
}) {
  const priorityColor = hit.priority === "HIGH" ? "var(--hit)" : hit.priority === "MED" ? "var(--amber)" : "var(--text-2)";
  const statusBadge = {
    pending:     { label: "PENDING",     color: "var(--hit)",    bg: "rgba(255,51,85,.1)"    },
    confirmed:   { label: "CONFIRMED",   color: "var(--good)",   bg: "rgba(43,217,124,.1)"   },
    dismissed:   { label: "DISMISSED",   color: "var(--text-3)", bg: "var(--bg-3)"            },
    wrong_state: { label: "WRONG STATE", color: "var(--amber)",  bg: "rgba(255,170,0,.1)"    },
  }[status];
  const borderColor = status === "pending" ? "var(--hit)" : status === "confirmed" ? "var(--good)" : status === "wrong_state" ? "var(--amber)" : "var(--line)";

  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `3px solid ${borderColor}`, background: "var(--bg-1)" }}>
      <div onClick={onExpand} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto auto auto", gap: 12, padding: "12px 16px", alignItems: "center", cursor: "pointer" }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-2)" }}>{hit.time}</div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: status === "pending" ? "var(--hit)" : "var(--text-0)" }}>{hit.plate}</span>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 2, background: hit.priority === "HIGH" ? "rgba(255,51,85,.15)" : "rgba(255,170,0,.1)", color: priorityColor, border: `1px solid ${priorityColor}40` }}>
              {hit.priority}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 2, background: statusBadge.bg, color: statusBadge.color }}>
              {statusBadge.label}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-2)" }}>{hit.vehicle} · {hit.state} · {hit.reason}</div>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-3)" }}>CAM {hit.camera}</div>
        <div style={{ color: "var(--text-3)" }}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--line)", padding: 16, background: "var(--bg-2)", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Side-by-side plate verification — differentiator #1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { heading: "Captured · CAM A", tag: "▶ LIVE", tagColor: "var(--accent)", border: "var(--hit)", note: "Plate Captured Live" },
              { heading: "NCIC (Natl. Crime Info.) Archive · 04/28", tag: "NCIC", tagColor: "var(--text-2)", border: "var(--line-2)", note: "✓ EXACT MATCH" },
            ].map(({ heading, tag, tagColor, border, note }) => (
              <div key={heading} style={{ border: "1px solid var(--line)", background: "var(--bg-1)", padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>{heading}</span>
                  <span style={{ fontFamily: MONO, fontSize: 8, color: tagColor }}>{tag}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: `2px solid ${border}`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ background: "#c0392b", width: "100%", textAlign: "center", padding: "3px 0", fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "white" }}>TEXAS</div>
                  <div style={{ background: "white", width: "100%", textAlign: "center", padding: "6px 0" }}>
                    <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 800, letterSpacing: "0.1em", color: "#111" }}>
                      {hit.plate.slice(0, 3)} {hit.plate.slice(3)}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--good)" }}>{note}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(43,217,124,.08)", border: "1px solid rgba(43,217,124,.2)", padding: "10px 14px", textAlign: "center", fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--good)" }}>
            ✓ Plate & State Auto-Verified · Vehicle Visually Consistent
          </div>

          {/* Officer Safety Flags */}
          <div style={{ background: "rgba(255,51,85,.05)", border: "1px solid rgba(255,51,85,.18)", padding: "10px 14px" }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8 }}>
              Officer Safety
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {hit.safetyFlags.map((f) => <SafetyChip key={f.label} label={f.label} variant={f.variant} />)}
            </div>
          </div>

          {status === "pending" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button onClick={() => { onStatusChange("confirmed"); onTriggerHit?.(); }} style={{ padding: "9px 12px", background: "var(--hit)", border: "none", color: "white", fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                Confirm Hit
              </button>
              <button onClick={() => onStatusChange("wrong_state")} style={{ padding: "9px 12px", background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--text-0)", fontFamily: MONO, fontSize: 10, fontWeight: 600, textTransform: "uppercase", cursor: "pointer" }}>
                Wrong State
              </button>
              <button onClick={() => onStatusChange("dismissed")} style={{ padding: "9px 12px", background: "var(--bg-3)", border: "1px solid var(--line-2)", color: "var(--text-0)", fontFamily: MONO, fontSize: 10, fontWeight: 600, textTransform: "uppercase", cursor: "pointer" }}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SafetyChip({ label, variant }: { label: string; variant: "hit" | "amber" | "accent" }) {
  const v = {
    hit:    { bg: "rgba(255,51,85,.1)",  border: "rgba(255,51,85,.4)",  text: "#ff7088" },
    amber:  { bg: "rgba(255,170,0,.1)",  border: "rgba(255,170,0,.4)",  text: "var(--amber)" },
    accent: { bg: "rgba(0,229,212,.1)",  border: "rgba(0,229,212,.4)",  text: "var(--accent)" },
  }[variant];
  return (
    <span style={{
      fontFamily: MONO, fontSize: 10, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "5px 10px", borderRadius: 4,
      background: v.bg, border: `1px solid ${v.border}`, color: v.text,
    }}>
      {label}
    </span>
  );
}
