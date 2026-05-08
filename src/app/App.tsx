import { useState, useEffect, useCallback } from "react";
import { DualCameraView } from "./components/DualCameraView";
import { HotlistAlert } from "./components/HotlistAlert";
import { TacticalGrid } from "./components/TacticalGrid";
import { TopBar, type MuteState } from "./components/TopBar";
import { StatusRail } from "./components/StatusRail";
import { BottomNav, type TabId } from "./components/BottomNav";
import { ReadTicker } from "./components/ReadTicker";
import { MapPanel } from "./components/MapPanel";
import { ActivitySection } from "./components/ActivitySection";
import { HitsTab } from "./components/HitsTab";
import { LookupTab } from "./components/LookupTab";
import { BoloTab } from "./components/BoloTab";
import { StakeoutTab } from "./components/StakeoutTab";

function playAlertTone() {
  try {
    const ctx = new AudioContext();
    [880, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  } catch {
    // AudioContext may be unavailable in some environments
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("patrol");
  const [showHotlistAlert, setShowHotlistAlert] = useState(false);
  const [scanCount, setScanCount] = useState(1247);
  const [hitCount, setHitCount] = useState(3);
  const [muteState, setMuteState] = useState<MuteState>("all");

  // Auto-unmute after 5 minutes when muted
  useEffect(() => {
    if (muteState === "muted") {
      const t = setTimeout(() => setMuteState("all"), 5 * 60 * 1000);
      return () => clearTimeout(t);
    }
  }, [muteState]);

  const cycleMute = useCallback(() => {
    setMuteState((s) => (s === "all" ? "high" : s === "high" ? "muted" : "all"));
  }, []);

  const triggerHit = useCallback(() => {
    if (muteState !== "muted") playAlertTone();
    setShowHotlistAlert(true);
    setActiveTab("patrol");
  }, [muteState]);

  const handleNewRead = useCallback(() => {
    setScanCount((p) => p + 1);
    if (Math.random() > 0.98) setHitCount((p) => p + 1);
  }, []);

  // Auto-trigger demo hit after 10s
  useEffect(() => {
    const t = setTimeout(() => {
      if (muteState !== "muted") playAlertTone();
      setShowHotlistAlert(true);
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background with radial gradients */}
      <div
        className="fixed inset-0 bg-[var(--bg-0)]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(0, 229, 212, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(0, 229, 212, 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Tactical grid overlay */}
      <TacticalGrid />

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* TOP BAR - 56px */}
        <TopBar scanCount={scanCount} hitCount={hitCount} muteState={muteState} onMuteToggle={cycleMute} />

        {/* STATUS RAIL - 32px */}
        <StatusRail />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "patrol" ? (
            <div className="h-full flex overflow-hidden">
              {/* LEFT PANEL - Dual camera + read ticker */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <DualCameraView />
                <ReadTicker onNewRead={handleNewRead} />
              </div>

              {/* RIGHT PANEL - 480px wide */}
              <div className="w-[480px] flex flex-col overflow-hidden">
                <MapPanel />
                <ActivitySection onTriggerHit={triggerHit} />
              </div>
            </div>
          ) : activeTab === "hits" ? (
            <HitsTab onTriggerHit={triggerHit} />
          ) : activeTab === "lookup" ? (
            <LookupTab />
          ) : activeTab === "bolo" ? (
            <BoloTab />
          ) : (
            <StakeoutTab />
          )}
        </div>

        {/* BOTTOM NAV - 64px */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Hotlist alert overlay */}
      {showHotlistAlert && (
        <HotlistAlert
          plate="JLW8931"
          state="TX"
          reason="STOLEN VEHICLE"
          vehicle="2014 Ford F-150"
          onDismiss={() => setShowHotlistAlert(false)}
        />
      )}

      {/* Demo Controls — bottom-right floating panel */}
      <div
        className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 p-3"
        style={{
          background: "var(--bg-3)",
          border: "1px solid var(--line-2)",
        }}
      >
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "var(--text-3)",
            textTransform: "uppercase",
          }}
        >
          Demo Controls
        </span>
        <button
          onClick={() => triggerHit()}
          className="px-3 py-1.5 text-white transition-opacity hover:opacity-80"
          style={{
            background: "var(--hit)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Trigger Hotlist Hit
        </button>
        <button
          onClick={() => { setShowHotlistAlert(false); setActiveTab("patrol"); setScanCount(1247); setHitCount(3); }}
          className="px-3 py-1.5 transition-opacity hover:opacity-80"
          style={{
            background: "var(--bg-4)",
            border: "1px solid var(--line-2)",
            color: "var(--text-1)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Reset Patrol Mode
        </button>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--bg-1);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--line-2);
          border-radius: 0;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: var(--accent-dim);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
