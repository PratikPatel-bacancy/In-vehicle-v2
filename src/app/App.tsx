import { useState, useEffect } from "react";
import { DualCameraView } from "./components/DualCameraView";
import { HotlistAlert } from "./components/HotlistAlert";
import { TacticalGrid } from "./components/TacticalGrid";
import { TopBar } from "./components/TopBar";
import { StatusRail } from "./components/StatusRail";
import { BottomNav } from "./components/BottomNav";
import { ReadTicker } from "./components/ReadTicker";
import { MapPanel } from "./components/MapPanel";
import { ActivitySection } from "./components/ActivitySection";

export default function App() {
  const [showHotlistAlert, setShowHotlistAlert] = useState(false);
  const [scanCount, setScanCount] = useState(1247);
  const [hitCount, setHitCount] = useState(3);

  // Simulate occasional hotlist alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHotlistAlert(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate scan count incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      setScanCount((prev) => prev + 1);
      if (Math.random() > 0.98) {
        setHitCount((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
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
        <TopBar scanCount={scanCount} hitCount={hitCount} />

        {/* STATUS RAIL - 32px */}
        <StatusRail />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL - Dual camera + read ticker */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dual camera view - fills remaining space */}
            <DualCameraView />

            {/* Read ticker - 110px fixed */}
            <ReadTicker />
          </div>

          {/* RIGHT PANEL - 480px wide */}
          <div className="w-[480px] flex flex-col overflow-hidden">
            {/* Map - 280px fixed */}
            <MapPanel />

            {/* Activity section - fills remaining */}
            <ActivitySection />
          </div>
        </div>

        {/* BOTTOM NAV - 64px */}
        <BottomNav />
      </div>

      {/* Hotlist alert overlay */}
      {showHotlistAlert && (
        <HotlistAlert
          plate="WNT4567"
          state="CA"
          reason="STOLEN VEHICLE"
          vehicle="2020 Honda Civic Blue"
          onDismiss={() => setShowHotlistAlert(false)}
        />
      )}

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
