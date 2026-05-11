import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, Check } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";

interface HotlistAlertProps {
  plate: string;
  state: string;
  reason: string;
  vehicle: string;
  onDismiss: () => void;
}

export function HotlistAlert({ plate, state, reason, vehicle, onDismiss }: HotlistAlertProps) {
  const [hitAge, setHitAge] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [dismissReason, setDismissReason] = useState<string | null>(null);

  useEffect(() => {
    const iv = setInterval(() => setHitAge((a) => a + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (confirmed) {
    return <ConfirmedOverlay plate={plate} onDismiss={onDismiss} />;
  }
  if (dismissReason) {
    return <DismissedOverlay reason={dismissReason} plate={plate} onDismiss={onDismiss} />;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Pulsing viewport border */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ border: "4px solid #ff3355", zIndex: 10 }}
          animate={{
            borderColor: ["#ff3355", "#ff6b85", "#ff3355"],
            boxShadow: [
              "inset 0 0 60px rgba(255,51,85,.3)",
              "inset 0 0 80px rgba(255,51,85,.5)",
              "inset 0 0 60px rgba(255,51,85,.3)",
            ],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(5,7,9,.96)", backdropFilter: "blur(14px)" }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col" style={{ zIndex: 1 }}>
          <AlertHeader hitAge={hitAge} pad={pad} reason={reason} vehicle={vehicle} state={state} plate={plate} onDismiss={onDismiss} />

          <div
            className="flex-1 overflow-hidden"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 380px",
              borderTop: "1px solid rgba(255,51,85,.2)",
            }}
          >
            <CapturedColumn />
            <HotlistColumn />
            <BriefingColumn onConfirm={() => setConfirmed(true)} onDismissWithReason={setDismissReason} />
          </div>
        </div>

        {/* PIP Camera */}
        <PIPCamera />
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── 8.1 HEADER ─────────────────────────────────────────────────────── */

function AlertHeader({
  hitAge, pad, reason, vehicle, state, plate, onDismiss,
}: {
  hitAge: number; pad: (n: number) => string;
  reason: string; vehicle: string; state: string; plate: string;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        padding: "18px 28px",
        background: "linear-gradient(to bottom, rgba(255,51,85,.18), transparent)",
        borderBottom: "1px solid rgba(255,51,85,.3)",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Siren icon */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px var(--hit-glow), 0 0 0 4px rgba(255,51,85,.2)",
            "0 0 50px var(--hit), 0 0 0 8px rgba(255,51,85,.3)",
            "0 0 30px var(--hit-glow), 0 0 0 4px rgba(255,51,85,.2)",
          ],
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 56, height: 56, borderRadius: 12,
          background: "var(--hit)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AlertTriangle size={24} color="white" strokeWidth={2.5} />
      </motion.div>

      {/* Title block */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.span
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              fontFamily: MONO, fontSize: 11, fontWeight: 700,
              letterSpacing: "0.24em", textTransform: "uppercase",
              color: "var(--hit)",
              background: "rgba(255,51,85,.12)",
              border: "1px solid rgba(255,51,85,.4)",
              padding: "2px 8px", borderRadius: 4,
            }}
          >
            ▶ LIVE HIT
          </motion.span>
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--hit)" }}>
            FBI · NCIC (Natl. Crime Info. Center) HOTLIST MATCH
          </span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-0)", lineHeight: 1.2 }}>
          <span style={{ color: "var(--hit)" }}>{reason}</span>
          {` · ${vehicle} · ${state} ${plate}`}
        </div>

        {/* Meta */}
        <div style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-2)" }}>
          Detected 14:23:45 · CAM A (Front) · Reported stolen 04/28/2026 · Tarrant County SO
        </div>
      </div>

      {/* Hit timer */}
      <div
        style={{
          background: "var(--bg-3)", border: "1px solid var(--line-2)",
          padding: "6px 12px", borderRadius: 4,
          fontFamily: MONO, fontSize: 11, color: "var(--text-2)",
          flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        Hit age:{" "}
        <span style={{ color: "var(--hit)", fontWeight: 700 }}>{pad(hitAge)}s</span>
      </div>

      {/* Close X */}
      <button
        onClick={onDismiss}
        style={{
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,.05)", border: "none", cursor: "pointer",
          flexShrink: 0, color: "var(--text-2)", transition: "background .15s, color .15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.14)"; (e.currentTarget as HTMLElement).style.color = "var(--text-0)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
      >
        <X size={20} />
      </button>
    </div>
  );
}

/* ─── 8.2 COLUMN 1: CAPTURED · LIVE ─────────────────────────────────── */

function CapturedColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,51,85,.15)", overflow: "hidden" }}>
      <ColHeader label="Captured · Live" tag="▶ LIVE FEED" tagColor="accent" />

      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <TruckRearSVG />
          {/* Plate highlight box — positioned over plate in SVG (y=206-260 in 360-tall viewBox = top 57%) */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1], boxShadow: ["0 0 8px rgba(255,51,85,.5)", "0 0 16px rgba(255,51,85,.8)", "0 0 8px rgba(255,51,85,.5)"] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: "absolute", top: "57%", left: "50%", transform: "translateX(-50%)",
              width: "22%", height: "15%",
              border: "2px solid var(--hit)",
              pointerEvents: "none",
            }}
          />
          {/* Dashed connecting line from highlight box down to callout */}
          <div style={{
            position: "absolute",
            top: "72%",
            bottom: "calc(10% + 56px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            borderLeft: "2px dashed rgba(255,51,85,.55)",
            pointerEvents: "none",
          }} />
          {/* Plate callout — absolute bottom-center of image */}
          <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
            <PlateCallout plate="JLW 8931" />
          </div>
        </div>
      </div>

      <ColFooter cells={[
        { label: "TIME", value: "14:23:45" },
        { label: "CAMERA", value: "A · FRONT" },
      ]} />
    </div>
  );
}

/* ─── 8.2 COLUMN 2: HOTLIST RECORD · VERIFY ─────────────────────────── */

function HotlistColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,51,85,.15)", overflow: "hidden" }}>
      <ColHeader label="Hotlist Record · Verify" tag="NCIC (Crime DB) · 04/28" tagColor="hit" />

      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <TruckSideSVG />
          {/* Plate callout — absolute bottom-center */}
          <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
            <PlateCallout plate="JLW 8931" />
          </div>
        </div>
      </div>

      <ColFooter cells={[
        { label: "REPORTED", value: "04/28/2026" },
        { label: "STATE", value: "TX · MATCH", color: "var(--good)" },
        { label: "PLATE", value: "EXACT", color: "var(--good)" },
      ]} />

      {/* Match confirmation banner */}
      <div
        style={{
          background: "rgba(43,217,124,.08)", borderTop: "1px solid rgba(43,217,124,.25)",
          padding: "14px 18px", textAlign: "center",
          fontFamily: MONO, fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--good)",
        }}
      >
        ✓ Plate & State Verified · Vehicle Visually Consistent
      </div>
    </div>
  );
}

/* ─── 8.2 COLUMN 3: VEHICLE & OFFICER BRIEFING ───────────────────────── */

function BriefingColumn({ onConfirm, onDismissWithReason }: { onConfirm: () => void; onDismissWithReason: (r: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-1)" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)", flexShrink: 0 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-0)" }}>
          Vehicle & Officer Briefing
        </span>
      </div>

      {/* Scrollable content */}
      <div className="scrollbar-thin" style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Officer Safety */}
        <BriefSection title="Officer Safety">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <SafetyChip label="ARMED & DANGEROUS" variant="hit" />
            <SafetyChip label="PRIOR · RESISTING" variant="amber" />
            <SafetyChip label="DASH-CAM ON" variant="accent" />
          </div>
        </BriefSection>

        {/* Legal Notice */}
        <div style={{ background: "rgba(255,170,0,.06)", borderLeft: "3px solid var(--amber)", padding: "10px 12px", borderTopRightRadius: 4 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>
            ⚠ NCIC (Natl. Crime Info. Center) VERIFICATION REQUIRED
          </div>
          <div style={{ fontSize: 11, color: "var(--text-0)", lineHeight: 1.5 }}>
            ALPR alert alone is not basis for action. Confirm hit via dispatch / NCIC before stop. Visually verify plate & state match (auto-checked above).
          </div>
        </div>

        {/* Vehicle */}
        <BriefSection title="Vehicle">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {([
              ["Make · Model", "Ford F-150", false],
              ["Year", "2014", false],
              ["Color", "Silver", false],
              ["VIN (last 4)", "··6F42", true],
              ["Speed", "22 MPH", true],
              ["Direction", "NE · Toward I-35", false],
            ] as [string, string, boolean][]).map(([label, value, mono]) => (
              <div key={label}>
                <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: mono ? MONO : undefined, fontSize: 13, fontWeight: 500, color: "var(--text-0)" }}>{value}</div>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Hotlist Source */}
        <BriefSection title="Hotlist Source">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {([
              ["Database", "NCIC (Natl. Crime Info.) · STLN", true, undefined],
              ["Priority", "HIGH", false, "var(--hit)"],
              ["Originator", "Tarrant Co. SO", false, undefined],
              ["Case #", "2026-04-7731", true, undefined],
              ["Reported", "04/28 · 09:14", false, undefined],
              ["Last sync", "02m ago", false, undefined],
            ] as [string, string, boolean, string | undefined][]).map(([label, value, mono, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)" }}>{label}</span>
                <span style={{ fontFamily: mono ? MONO : undefined, fontSize: 12, color: color ?? "var(--text-0)", fontWeight: color ? 700 : 400 }}>{value}</span>
              </div>
            ))}
          </div>
        </BriefSection>

        {/* Location */}
        <BriefSection title="Location · Direction">
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3 }}>Detected at</div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-0)" }}>32.9226°N · 97.0897°W</div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 4 }}>N. Main & W. Oak · Walmart Lot</div>
          </div>
        </BriefSection>
      </div>

      {/* Sticky action buttons */}
      <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
        {/* Primary */}
        <motion.button
          onClick={onConfirm}
          whileHover={{ filter: "brightness(1.12)", boxShadow: "0 6px 20px rgba(255,51,85,.5)" }}
          style={{
            width: "100%", padding: "14px 18px",
            background: "var(--hit)", border: "none", borderRadius: 8,
            color: "white", fontFamily: MONO, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(255,51,85,.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Check size={16} />
          Confirm Hit · Notify Dispatch
        </motion.button>

        {/* Secondary row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <SecondaryBtn label="Wrong State" onClick={() => onDismissWithReason("WRONG STATE")} />
          <SecondaryBtn label="Wrong Plate" onClick={() => onDismissWithReason("WRONG PLATE")} />
        </div>

        {/* Tertiary */}
        <SecondaryBtn label="Acknowledge · Don't Intercept" full onClick={() => onDismissWithReason("ACKNOWLEDGED")} />
      </div>
    </div>
  );
}

/* ─── 8.3 PIP TRACKING CAMERA ────────────────────────────────────────── */

function PIPCamera() {
  return (
    <div
      style={{
        position: "absolute", bottom: 20, right: 400,
        width: 200, height: 130,
        border: "2px solid var(--accent)", borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,.6)",
        zIndex: 20,
      }}
    >
      <div style={{ width: "100%", height: "100%", background: "var(--bg-2)", position: "relative" }}>
        <TruckPIPSVG />

        {/* Plate ROI — pulsing */}
        <motion.div
          animate={{ opacity: [1, 0.3, 1], boxShadow: ["0 0 6px rgba(255,51,85,.6)", "0 0 12px rgba(255,51,85,.9)", "0 0 6px rgba(255,51,85,.6)"] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            position: "absolute", bottom: "28%", left: "50%", transform: "translateX(-50%)",
            width: 52, height: 16,
            border: "1px solid var(--hit)",
            pointerEvents: "none",
          }}
        />

        {/* Label */}
        <div style={{ position: "absolute", top: 6, left: 8, display: "flex", alignItems: "center", gap: 4 }}>
          <motion.div
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--hit)" }}
          />
          <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-0)" }}>
            TRACKING · CAM A
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── 8.4 CONFIRMED OVERLAY ──────────────────────────────────────────── */

function ConfirmedOverlay({ plate, onDismiss }: { plate: string; onDismiss: () => void }) {
  const actions = [
    "CAD (Computer-Aided Dispatch) entry created · Spillman #2026-44782",
    "BWC (Body-Worn Camera) marked · Axon Body 4",
    "Unit status → INVESTIGATING",
    "Plate text copied to clipboard",
    "Adjacent units (U-04, U-07) alerted within 2mi",
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "rgba(5,7,9,.94)", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, maxWidth: 460, padding: "0 24px" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(43,217,124,.15)",
            border: "2px solid var(--good)",
            boxShadow: "0 0 30px rgba(43,217,124,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Check size={50} style={{ color: "var(--good)" }} />
        </motion.div>

        <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-0)", textAlign: "center", lineHeight: 1.2 }}>
          Hit Confirmed · Dispatch Notified
        </div>

        <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-2)", textAlign: "center" }}>
          Unit <b style={{ color: "var(--accent)" }}>01</b> intercepting ·{" "}
          Plate <b style={{ color: "var(--accent)" }}>{plate}</b> ·{" "}
          NCIC (Natl. Crime Info. Center) <b style={{ color: "var(--accent)" }}>STLN (Stolen)</b>
        </div>

        {/* Image 5: Body-cam thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ alignSelf: "stretch", border: "1px solid var(--line-2)", overflow: "hidden", position: "relative" }}
        >
          <BodyCamSVG />
          <div style={{ position: "absolute", top: 6, left: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <motion.div
              animate={{ opacity: [1, 0.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--hit)" }}
            />
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-0)" }}>
              BODY CAM · UNIT 01
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 5, right: 8, fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,.45)" }}>
            14:24:11
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignSelf: "stretch" }}>
          {actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.28 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.28 + 0.05, type: "spring", stiffness: 400, damping: 20 }}
              >
                <Check size={14} style={{ color: "var(--good)", flexShrink: 0 }} />
              </motion.div>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-0)" }}>{action}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onDismiss}
          style={{
            marginTop: 8, minWidth: 200, padding: "12px 24px",
            background: "var(--bg-3)", border: "1px solid var(--line-2)",
            color: "var(--text-0)", fontFamily: MONO, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
          }}
        >
          Return to Patrol Mode
        </button>
      </div>
    </motion.div>
  );
}

/* ─── 8.5 DISMISSED OVERLAY ─────────────────────────────────────────── */

function DismissedOverlay({ reason, plate, onDismiss }: { reason: string; plate: string; onDismiss: () => void }) {
  const isAck = reason === "ACKNOWLEDGED";
  const title = isAck ? "Acknowledged · No Intercept" : `Dismissed · ${reason.replace(/_/g, " ")}`;
  const actions = [
    "Hit outcome logged · Spillman",
    `${plate} flagged for manual review`,
    "Unit status → PATROL",
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "rgba(5,7,9,.94)", backdropFilter: "blur(20px)" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, maxWidth: 460, padding: "0 24px", textAlign: "center" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,170,0,.12)",
            border: "2px solid var(--amber)",
            boxShadow: "0 0 30px rgba(255,170,0,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={48} style={{ color: "var(--amber)" }} />
        </motion.div>

        <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-0)", lineHeight: 1.2 }}>{title}</div>

        <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--text-2)" }}>
          Plate <b style={{ color: "var(--text-0)" }}>{plate}</b> · Logged as{" "}
          <b style={{ color: "var(--amber)" }}>{reason}</b>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignSelf: "stretch" }}>
          {actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.18 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <Check size={14} style={{ color: "var(--text-3)", flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-2)" }}>{action}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onDismiss}
          style={{
            marginTop: 8, minWidth: 200, padding: "12px 24px",
            background: "var(--bg-3)", border: "1px solid var(--line-2)",
            color: "var(--text-0)", fontFamily: MONO, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
          }}
        >
          Return to Patrol Mode
        </button>
      </div>
    </motion.div>
  );
}

/* ─── SHARED HELPERS ─────────────────────────────────────────────────── */

function ColHeader({ label, tag, tagColor }: { label: string; tag: string; tagColor: "accent" | "hit" }) {
  const isAccent = tagColor === "accent";
  return (
    <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-2)", flexShrink: 0 }}>
      <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-0)" }}>{label}</span>
      <span style={{
        fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
        color: isAccent ? "var(--accent)" : "var(--hit)",
        background: isAccent ? "rgba(0,229,212,.1)" : "rgba(255,51,85,.1)",
        border: `1px solid ${isAccent ? "rgba(0,229,212,.3)" : "rgba(255,51,85,.3)"}`,
        padding: "2px 8px", borderRadius: 3,
      }}>
        {tag}
      </span>
    </div>
  );
}

function ColFooter({ cells }: { cells: { label: string; value: string; color?: string }[] }) {
  return (
    <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", padding: "12px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, flexShrink: 0 }}>
      {cells.map(({ label, value, color }) => (
        <div key={label}>
          <div style={{ fontFamily: MONO, fontSize: 9, textTransform: "uppercase", color: "var(--text-3)", marginBottom: 2 }}>{label}</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: color ?? "var(--text-0)", fontWeight: color ? 700 : 400 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function PlateCallout({ plate }: { plate: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      border: "2px solid var(--hit)", boxShadow: "0 4px 20px rgba(0,0,0,.5)",
      overflow: "hidden", alignSelf: "center", minWidth: 150,
    }}>
      <div style={{ background: "#c0392b", width: "100%", textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "white", padding: "3px 0" }}>
        TEXAS
      </div>
      <div style={{ background: "white", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 12px" }}>
        <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, letterSpacing: "0.12em", color: "#111", lineHeight: 1 }}>
          {plate}
        </span>
      </div>
    </div>
  );
}

function BriefSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", paddingBottom: 8, borderBottom: "1px solid var(--line)", marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SafetyChip({ label, variant }: { label: string; variant: "hit" | "amber" | "accent" }) {
  const v = {
    hit:   { bg: "rgba(255,51,85,.1)",  border: "rgba(255,51,85,.4)",  text: "#ff7088" },
    amber: { bg: "rgba(255,170,0,.1)",  border: "rgba(255,170,0,.4)",  text: "var(--amber)" },
    accent:{ bg: "rgba(0,229,212,.1)",  border: "rgba(0,229,212,.4)",  text: "var(--accent)" },
  }[variant];

  return (
    <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 4, background: v.bg, border: `1px solid ${v.border}`, color: v.text }}>
      {label}
    </span>
  );
}

function SecondaryBtn({ label, full, onClick }: { label: string; full?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-0)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--line-2)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-0)";
      }}
      style={{
        width: full ? "100%" : undefined, padding: "9px 12px",
        background: "var(--bg-3)", border: "1px solid var(--line-2)",
        color: "var(--text-0)", fontFamily: MONO, fontSize: 10, fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
        transition: "border-color .15s, color .15s",
      }}
    >
      {label}
    </button>
  );
}

/* ─── IMAGE 5: Body-cam SVG thumbnail ───────────────────────────────── */

function BodyCamSVG() {
  return (
    <svg width="100%" height="80" viewBox="0 0 460 80" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="bcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#507090" />
          <stop offset="100%" stopColor="#6a8aa4" />
        </linearGradient>
        <linearGradient id="bcGnd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303840" />
          <stop offset="100%" stopColor="#1c2228" />
        </linearGradient>
      </defs>
      {/* Background — chest-mount POV, slightly fisheye-wide */}
      <rect width="460" height="80" fill="url(#bcSky)" />
      <rect y="44" width="460" height="36" fill="url(#bcGnd)" />
      <line x1="0" y1="44" x2="460" y2="44" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      {/* Road markings */}
      <path d="M 210,80 L 218,44 L 242,44 L 250,80 Z" fill="rgba(255,255,255,.06)" />
      {/* Distant F-150 */}
      <rect x="185" y="24" width="90" height="28" rx="3" fill="#bbb" />
      <rect x="193" y="18" width="74" height="12" rx="2" fill="#c4c4c4" />
      <rect x="185" y="38" width="90" height="14" rx="1" fill="#a8aaac" />
      {/* Taillights */}
      <rect x="187" y="26" width="14" height="20" rx="2" fill="#dd1122" opacity="0.9" />
      <rect x="261" y="26" width="14" height="20" rx="2" fill="#dd1122" opacity="0.9" />
      {/* License plate tiny */}
      <rect x="213" y="40" width="34" height="10" rx="1" fill="#f0ead8" />
      <text x="230" y="48" textAnchor="middle" fill="#111" fontSize="5.5" fontFamily="monospace" fontWeight="700" letterSpacing="1">JLW 8931</text>
      {/* Officer hands / radio (lower frame) */}
      <path d="M 0,80 Q 60,58 130,72 L 130,80 Z" fill="#2c3038" opacity="0.7" />
      <path d="M 460,80 Q 400,58 330,72 L 330,80 Z" fill="#2c3038" opacity="0.7" />
      {/* Radio outline */}
      <rect x="196" y="62" width="28" height="16" rx="3" fill="#1e242c" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      <rect x="200" y="66" width="20" height="3" rx="1" fill="rgba(255,255,255,.15)" />
      {/* Scan-line overlay — subtle body-cam CCD artifact */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="0" y={i * 20} width="460" height="1" fill="rgba(0,229,212,.04)" />
      ))}
    </svg>
  );
}

/* ─── SVG ILLUSTRATIONS ──────────────────────────────────────────────── */

function TruckRearSVG() {
  return (
    <svg viewBox="0 0 560 360" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* IMAGE 1: Bright midday daylight, sunny parking lot */}
        <linearGradient id="sky-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a84b8" />
          <stop offset="55%" stopColor="#7aaecb" />
          <stop offset="100%" stopColor="#a8c4d4" />
        </linearGradient>
        <linearGradient id="haze-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8ccd8" stopOpacity="0" />
          <stop offset="100%" stopColor="#b8ccd8" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="pave-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3e42" />
          <stop offset="100%" stopColor="#24282c" />
        </linearGradient>
        <linearGradient id="store-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ea2a4" />
          <stop offset="100%" stopColor="#868a8c" />
        </linearGradient>
      </defs>

      {/* ── Sky — bright midday blue ── */}
      <rect width="560" height="360" fill="url(#sky-r)" />
      {/* Horizon haze */}
      <rect y="148" width="560" height="52" fill="url(#haze-r)" />
      {/* Clouds */}
      <ellipse cx="96" cy="62" rx="58" ry="18" fill="rgba(255,255,255,.2)" />
      <ellipse cx="138" cy="52" rx="44" ry="14" fill="rgba(255,255,255,.26)" />
      <ellipse cx="420" cy="78" rx="72" ry="20" fill="rgba(255,255,255,.16)" />
      <ellipse cx="464" cy="66" rx="50" ry="15" fill="rgba(255,255,255,.22)" />

      {/* ── Background trees (distant) ── */}
      {[0, 30, 65, 100, 460, 495, 525, 548].map((x, i) => (
        <ellipse key={i} cx={x + 18} cy={172 - (i % 3) * 8} rx={22} ry={14 + (i % 3) * 4}
          fill={i % 2 === 0 ? "#4e6840" : "#3e5432"} opacity="0.7" />
      ))}

      {/* ── Walmart-style store facade ── */}
      <rect x="0" y="62" width="560" height="136" fill="url(#store-r)" />
      <rect x="0" y="59" width="560" height="7" fill="#787c7e" />
      {/* Facade vertical panel joints */}
      {[80, 160, 240, 320, 400, 480].map((x) => (
        <line key={x} x1={x} y1="62" x2={x} y2="198" stroke="rgba(0,0,0,.06)" strokeWidth="1.5" />
      ))}
      {/* Storefront windows */}
      {[22, 96, 172, 248, 325, 400, 476].map((x) => (
        <g key={x}>
          <rect x={x} y="80" width="58" height="44" fill="#c8d8e4" rx="1" opacity="0.52" />
          <line x1={x + 29} y1="80" x2={x + 29} y2="124" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
          <rect x={x} y="80" width="58" height="44" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" rx="1" />
        </g>
      ))}
      {/* Store awning */}
      <rect x="0" y="152" width="560" height="14" fill="#6a6e70" />
      <rect x="0" y="154" width="560" height="4" fill="rgba(0,0,0,.14)" />
      {/* Walmart sign */}
      <rect x="160" y="22" width="240" height="38" fill="#0071ce" rx="5" />
      <rect x="162" y="24" width="236" height="34" fill="none" stroke="#005ba0" strokeWidth="2" rx="4" />
      <text x="280" y="47" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing="2">Walmart</text>
      {/* Walmart spark */}
      <text x="280" y="17" textAnchor="middle" fill="#ffc220" fontSize="14" fontFamily="sans-serif">✦</text>

      {/* ── Pavement — midday asphalt ── */}
      <rect y="166" width="560" height="194" fill="url(#pave-r)" />
      {/* Subtle asphalt grain */}
      <rect y="200" width="560" height="1" fill="rgba(255,255,255,.025)" />
      <rect y="240" width="560" height="1" fill="rgba(255,255,255,.02)" />
      <rect y="300" width="560" height="1" fill="rgba(255,255,255,.015)" />

      {/* Parking lines — bright midday white */}
      <g stroke="rgba(255,255,255,.65)" strokeWidth="2">
        <line x1="34" y1="360" x2="72" y2="168" />
        <line x1="128" y1="360" x2="148" y2="168" />
        <line x1="222" y1="360" x2="228" y2="168" />
        <line x1="316" y1="360" x2="310" y2="168" />
        <line x1="408" y1="360" x2="388" y2="168" />
        <line x1="500" y1="360" x2="466" y2="168" />
      </g>
      {/* Stop bar */}
      <line x1="0" y1="320" x2="560" y2="320" stroke="rgba(255,255,255,.28)" strokeWidth="2.5" />

      {/* Parked cars — left & right background */}
      <rect x="6" y="182" width="64" height="40" rx="3" fill="#545c60" opacity="0.72" />
      <rect x="10" y="175" width="56" height="12" rx="2" fill="#4a5458" opacity="0.7" />
      <rect x="490" y="184" width="66" height="38" rx="3" fill="#484e55" opacity="0.68" />
      <rect x="494" y="177" width="58" height="12" rx="2" fill="#404850" opacity="0.65" />

      {/* ── TRUCK REAR — silver F-150 in midday sun ── */}
      {/* Cab top */}
      <rect x="92" y="88" width="376" height="30" rx="5" fill="#cccecf" stroke="#909496" strokeWidth="1.5" />
      <rect x="102" y="93" width="356" height="20" rx="2" fill="#1a2530" opacity="0.87" />
      {/* Body highlight from sun above */}
      <rect x="92" y="88" width="376" height="8" rx="5" fill="rgba(255,255,255,.12)" />

      {/* Main body */}
      <rect x="76" y="112" width="408" height="156" rx="5" fill="#cccecf" stroke="#909496" strokeWidth="1.5" />
      {/* Sun glint on body top edge */}
      <rect x="76" y="112" width="408" height="10" rx="5" fill="rgba(255,255,255,.1)" />

      {/* Tailgate */}
      <rect x="87" y="160" width="386" height="98" rx="4" fill="#bcbebf" stroke="#8a8c8e" strokeWidth="1" />
      <rect x="108" y="172" width="344" height="76" rx="3" fill="#aeaeb0" />
      {/* Tailgate emboss highlight */}
      <rect x="108" y="172" width="344" height="6" rx="2" fill="rgba(255,255,255,.09)" />

      {/* Ford oval badge */}
      <ellipse cx="280" cy="196" rx="31" ry="18" fill="#003399" />
      <ellipse cx="280" cy="196" rx="25.5" ry="14" fill="#0044cc" />
      <text x="280" y="201" textAnchor="middle" fill="white" fontSize="11" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700">Ford</text>

      {/* F-150 badge */}
      <text x="416" y="182" fill="rgba(255,255,255,.72)" fontSize="9.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.5">F-150</text>

      {/* Texas plate */}
      <rect x="218" y="208" width="124" height="54" rx="3" fill="#f5f0e0" stroke="#ccc8a8" strokeWidth="1" />
      <rect x="218" y="208" width="124" height="14" rx="3" fill="#c0392b" />
      <rect x="218" y="217" width="124" height="5" fill="#c0392b" />
      <text x="280" y="220" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="800" letterSpacing="3.5">TEXAS</text>
      <text x="229" y="253" fill="#c0392b" fontSize="8" fontFamily="sans-serif" opacity="0.65">★</text>
      <text x="323" y="253" fill="#c0392b" fontSize="8" fontFamily="sans-serif" opacity="0.65">★</text>
      <text x="280" y="253" textAnchor="middle" fill="#111" fontSize="18" fontFamily="monospace" fontWeight="800" letterSpacing="4">JLW 8931</text>

      {/* Left taillight cluster */}
      <rect x="78" y="116" width="36" height="68" rx="4" fill="#cc1122" opacity="0.92" />
      <rect x="78" y="116" width="36" height="68" rx="4" fill="none" stroke="#ee2233" strokeWidth="1" />
      <rect x="82" y="120" width="28" height="60" rx="3" fill="rgba(255,80,80,.26)" />
      <rect x="84" y="122" width="20" height="26" rx="2" fill="rgba(255,200,200,.16)" />

      {/* Right taillight cluster */}
      <rect x="446" y="116" width="36" height="68" rx="4" fill="#cc1122" opacity="0.92" />
      <rect x="446" y="116" width="36" height="68" rx="4" fill="none" stroke="#ee2233" strokeWidth="1" />
      <rect x="450" y="120" width="28" height="60" rx="3" fill="rgba(255,80,80,.26)" />
      <rect x="456" y="122" width="20" height="26" rx="2" fill="rgba(255,200,200,.16)" />

      {/* Step bumper */}
      <rect x="76" y="264" width="408" height="18" rx="3" fill="#1e2226" />
      <rect x="88" y="266" width="384" height="8" rx="2" fill="#282c30" />
      {/* Hitch */}
      <rect x="264" y="280" width="32" height="8" rx="3" fill="#26292e" />

      {/* Ground shadow (midday = shorter, centered) */}
      <ellipse cx="280" cy="355" rx="172" ry="8" fill="rgba(0,0,0,.38)" />

      {/* Wheels */}
      <circle cx="142" cy="296" r="36" fill="#1a1a1a" />
      <circle cx="142" cy="296" r="27" fill="#242424" />
      <circle cx="142" cy="296" r="11" fill="#3c3c3c" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a}
          x1={142 + 13 * Math.cos(a * Math.PI / 180)} y1={296 + 13 * Math.sin(a * Math.PI / 180)}
          x2={142 + 25 * Math.cos(a * Math.PI / 180)} y2={296 + 25 * Math.sin(a * Math.PI / 180)}
          stroke="#484848" strokeWidth="4" />
      ))}
      <circle cx="418" cy="296" r="36" fill="#1a1a1a" />
      <circle cx="418" cy="296" r="27" fill="#242424" />
      <circle cx="418" cy="296" r="11" fill="#3c3c3c" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a}
          x1={418 + 13 * Math.cos(a * Math.PI / 180)} y1={296 + 13 * Math.sin(a * Math.PI / 180)}
          x2={418 + 25 * Math.cos(a * Math.PI / 180)} y2={296 + 25 * Math.sin(a * Math.PI / 180)}
          stroke="#484848" strokeWidth="4" />
      ))}
    </svg>
  );
}

function TruckSideSVG() {
  return (
    <svg viewBox="0 0 560 360" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* IMAGE 2: Soft afternoon, slightly overcast, suburban residential */}
        <linearGradient id="sky-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8aaabb" />
          <stop offset="45%" stopColor="#a0bbc9" />
          <stop offset="100%" stopColor="#b8cad0" />
        </linearGradient>
        <linearGradient id="lawn-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a7c42" />
          <stop offset="100%" stopColor="#446030" />
        </linearGradient>
        <linearGradient id="drive-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a6e72" />
          <stop offset="100%" stopColor="#4a4e52" />
        </linearGradient>
        <linearGradient id="brick-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8c6e56" />
          <stop offset="100%" stopColor="#7a5c46" />
        </linearGradient>
      </defs>

      {/* ── Sky — overcast afternoon ── */}
      <rect width="560" height="360" fill="url(#sky-s)" />
      {/* Soft cloud cover suggestion */}
      <ellipse cx="140" cy="50" rx="110" ry="28" fill="rgba(255,255,255,.18)" />
      <ellipse cx="280" cy="36" rx="90" ry="22" fill="rgba(255,255,255,.14)" />
      <ellipse cx="440" cy="58" rx="100" ry="26" fill="rgba(255,255,255,.16)" />

      {/* ── Background: lawn and sky meet ── */}
      {/* Full lawn base */}
      <rect x="0" y="252" width="560" height="108" fill="url(#lawn-s)" />
      <rect x="0" y="250" width="560" height="4" fill="rgba(0,0,0,.12)" />
      {/* Lawn texture — subtle stripe */}
      {[258, 275, 292, 309].map((y) => (
        <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(0,0,0,.04)" strokeWidth="2" />
      ))}

      {/* ── Driveway — asphalt strip ── */}
      <path d="M 28,360 L 50,252 L 210,252 L 232,360 Z" fill="url(#drive-s)" />
      <path d="M 28,360 L 50,252 L 52,252 L 30,360 Z" fill="rgba(255,255,255,.05)" />
      {/* Driveway crack */}
      <line x1="100" y1="360" x2="110" y2="252" stroke="rgba(0,0,0,.08)" strokeWidth="1" />

      {/* ── House — brown brick single story ── */}
      {/* Main wall */}
      <rect x="320" y="82" width="232" height="178" fill="url(#brick-s)" />
      {/* Brick texture rows */}
      {[95, 108, 121, 134, 147, 160, 173, 186, 199, 212, 225, 238].map((y, ri) => (
        <g key={y}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((bi) => (
            <rect key={bi} x={320 + bi * 29 + (ri % 2) * 14} y={y} width="26" height="11"
              fill="rgba(0,0,0,.04)" rx="0.5" />
          ))}
        </g>
      ))}
      {/* Mortar lines */}
      {[94, 107, 120, 133, 146, 159, 172, 185, 198, 211, 224, 237, 250].map((y) => (
        <line key={y} x1="320" y1={y} x2="552" y2={y} stroke="rgba(200,180,160,.25)" strokeWidth="1" />
      ))}

      {/* Gable / roof */}
      <polygon points="308,82 552,82 552,46 430,12" fill="#6a4e32" />
      <polygon points="308,82 430,12 308,82" fill="#5a4028" opacity="0.3" />
      {/* Roof overhang shadow */}
      <rect x="308" y="78" width="244" height="8" fill="rgba(0,0,0,.18)" />

      {/* Windows */}
      <rect x="355" y="114" width="52" height="50" rx="2" fill="#c8d8e4" stroke="#5a4030" strokeWidth="2" />
      <line x1="381" y1="114" x2="381" y2="164" stroke="#5a4030" strokeWidth="1.5" />
      <line x1="355" y1="139" x2="407" y2="139" stroke="#5a4030" strokeWidth="1.5" />
      <rect x="355" y="114" width="52" height="50" fill="rgba(255,255,255,.08)" rx="2" />

      <rect x="448" y="114" width="52" height="50" rx="2" fill="#c8d8e4" stroke="#5a4030" strokeWidth="2" />
      <line x1="474" y1="114" x2="474" y2="164" stroke="#5a4030" strokeWidth="1.5" />
      <line x1="448" y1="139" x2="500" y2="139" stroke="#5a4030" strokeWidth="1.5" />
      <rect x="448" y="114" width="52" height="50" fill="rgba(255,255,255,.08)" rx="2" />

      {/* Garage door */}
      <rect x="350" y="196" width="120" height="64" rx="2" fill="#8a7a6a" stroke="#6a5a4a" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="350" y1={208 + i * 16} x2="470" y2={208 + i * 16} stroke="rgba(0,0,0,.12)" strokeWidth="1.5" />
      ))}
      {[375, 400, 422].map((x) => (
        <line key={x} x1={x} y1="196" x2={x} y2="260" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
      ))}
      {/* Garage door handle */}
      <rect x="404" y="228" width="10" height="6" rx="3" fill="rgba(255,255,255,.3)" />

      {/* Front door */}
      <rect x="508" y="200" width="36" height="58" rx="2" fill="#5a3820" stroke="#4a2c14" strokeWidth="1.5" />
      <rect x="512" y="204" width="28" height="28" rx="1" fill="#c8a870" opacity="0.4" />
      <circle cx="540" cy="230" r="2" fill="#c8b090" />

      {/* ── Trees — mature oak style ── */}
      {/* Left foreground oak */}
      <rect x="28" y="178" width="13" height="82" fill="#5a3e24" />
      <ellipse cx="40" cy="155" rx="46" ry="42" fill="#2e5a1c" />
      <ellipse cx="34" cy="148" rx="36" ry="34" fill="#386228" />
      <ellipse cx="48" cy="144" rx="30" ry="28" fill="#3a6828" />
      <ellipse cx="40" cy="162" rx="40" ry="22" fill="#2a5218" opacity="0.5" />

      {/* Middle background tree */}
      <rect x="296" y="212" width="10" height="48" fill="#5a3e24" />
      <ellipse cx="302" cy="192" rx="34" ry="32" fill="#306020" />
      <ellipse cx="308" cy="185" rx="26" ry="26" fill="#3a6c28" />

      {/* Right background shrub */}
      <ellipse cx="318" cy="248" rx="22" ry="12" fill="#3e6c28" opacity="0.7" />

      {/* ── TRUCK SIDE — silver F-150 on driveway ── */}
      {/* Truck bed */}
      <rect x="22" y="156" width="238" height="106" rx="4" fill="#c8cac8" stroke="#8a8c8a" strokeWidth="1.5" />
      <rect x="22" y="154" width="240" height="9" rx="2" fill="#b4b6b4" />
      {/* Bed rail */}
      <rect x="22" y="154" width="240" height="4" rx="2" fill="#caccc8" />
      {/* Bed side panel crease */}
      <line x1="22" y1="210" x2="260" y2="210" stroke="rgba(0,0,0,.08)" strokeWidth="2" />

      {/* Cab */}
      <rect x="248" y="126" width="202" height="136" rx="6" fill="#c8cac8" stroke="#8a8c8a" strokeWidth="1.5" />
      {/* Cab roof curve */}
      <path d="M 254,126 Q 284,96 386,90 Q 452,88 449,126 Z" fill="#d0d2d0" />
      {/* A-pillar / rear pillar */}
      <path d="M 384,92 Q 442,90 449,126 L 384,126 Z" fill="#1a2530" opacity="0.82" />
      {/* Front window */}
      <rect x="264" y="134" width="80" height="52" rx="3" fill="#1a2530" opacity="0.82" />
      {/* Window glare */}
      <path d="M 266,136 L 290,136 L 282,154 L 266,154 Z" fill="rgba(255,255,255,.06)" />
      {/* Rear side window */}
      <rect x="356" y="134" width="60" height="52" rx="3" fill="#1a2530" opacity="0.78" />
      {/* Door handle */}
      <rect x="310" y="193" width="22" height="5" rx="2.5" fill="#9a9c9a" />
      {/* Door seam */}
      <line x1="352" y1="126" x2="352" y2="262" stroke="rgba(0,0,0,.1)" strokeWidth="1.5" />

      {/* Chrome step bar */}
      <rect x="50" y="248" width="360" height="6" rx="3" fill="#c0c2c0" stroke="#9a9c9a" strokeWidth="1" />

      {/* Front bumper */}
      <rect x="444" y="240" width="26" height="24" rx="3" fill="#262a2e" />
      {/* Rear bumper */}
      <rect x="20" y="242" width="12" height="20" rx="2" fill="#262a2e" />

      {/* Rear plate */}
      <rect x="36" y="216" width="64" height="28" rx="2" fill="#f5f0e0" stroke="#d0c8a8" strokeWidth="1" />
      <rect x="36" y="216" width="64" height="8" rx="2" fill="#c0392b" />
      <rect x="36" y="221" width="64" height="3" fill="#c0392b" />
      <text x="68" y="230" textAnchor="middle" fill="rgba(255,255,255,.9)" fontSize="5.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">TEXAS</text>
      <text x="68" y="238" textAnchor="middle" fill="#111" fontSize="9" fontFamily="monospace" fontWeight="800" letterSpacing="1.5">JLW 8931</text>

      {/* Taillight */}
      <rect x="22" y="166" width="10" height="38" rx="2" fill="#cc1122" opacity="0.82" />

      {/* Headlight */}
      <rect x="448" y="162" width="12" height="28" rx="2" fill="#e8e8c0" opacity="0.7" />

      {/* Long shadow — afternoon sun from right */}
      <ellipse cx="160" cy="357" rx="145" ry="7" fill="rgba(0,0,0,.28)" />

      {/* Wheels */}
      <circle cx="104" cy="284" r="40" fill="#1a1a1a" />
      <circle cx="104" cy="284" r="30" fill="#262626" />
      <circle cx="104" cy="284" r="13" fill="#404040" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a}
          x1={104 + 15 * Math.cos(a * Math.PI / 180)} y1={284 + 15 * Math.sin(a * Math.PI / 180)}
          x2={104 + 28 * Math.cos(a * Math.PI / 180)} y2={284 + 28 * Math.sin(a * Math.PI / 180)}
          stroke="#505050" strokeWidth="3.5" />
      ))}
      <circle cx="374" cy="284" r="40" fill="#1a1a1a" />
      <circle cx="374" cy="284" r="30" fill="#262626" />
      <circle cx="374" cy="284" r="13" fill="#404040" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a}
          x1={374 + 15 * Math.cos(a * Math.PI / 180)} y1={284 + 15 * Math.sin(a * Math.PI / 180)}
          x2={374 + 28 * Math.cos(a * Math.PI / 180)} y2={284 + 28 * Math.sin(a * Math.PI / 180)}
          stroke="#505050" strokeWidth="3.5" />
      ))}

      {/* NCIC watermark */}
      <text x="552" y="352" textAnchor="end" fill="rgba(255,255,255,.38)" fontSize="8.5" fontFamily="monospace">NCIC · 04/28/2026 · INSURED PHOTO</text>
    </svg>
  );
}

function TruckPIPSVG() {
  return (
    <svg viewBox="0 0 200 130" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pip-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1117" /><stop offset="100%" stopColor="#0a0f18" />
        </linearGradient>
      </defs>
      <rect width="200" height="130" fill="url(#pip-bg)" />
      <rect y="97" width="200" height="33" fill="#111418" />
      {/* Simplified truck */}
      <rect x="32" y="50" width="136" height="52" rx="3" fill="#b0b4bc" />
      <rect x="37" y="43" width="126" height="12" rx="2" fill="#b8bcc4" />
      {/* Taillights */}
      <rect x="32" y="52" width="15" height="26" rx="2" fill="#cc1122" opacity=".9" />
      <rect x="153" y="52" width="15" height="26" rx="2" fill="#cc1122" opacity=".9" />
      {/* Plate */}
      <rect x="74" y="76" width="52" height="20" rx="2" fill="#f5f0e0" />
      <rect x="74" y="76" width="52" height="6" fill="#c0392b" />
      <text x="100" y="89" textAnchor="middle" fill="#111" fontSize="7" fontFamily="monospace" fontWeight="800" letterSpacing="1">JLW 8931</text>
      {/* Wheels */}
      <circle cx="64" cy="102" r="13" fill="#1a1a1a" /><circle cx="136" cy="102" r="13" fill="#1a1a1a" />
      {/* Scan-line overlay */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="0" y={i * 26} width="200" height="1" fill="rgba(0,229,212,.07)" />
      ))}
    </svg>
  );
}
