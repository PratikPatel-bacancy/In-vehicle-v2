import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface PlateCard {
  id: string;
  plate: string;
  state: string;
  camera: "A" | "B";
  vehicle: string;
  confidence: number;
  isNew: boolean;
}

interface ReadTickerProps {
  onNewRead?: () => void;
}

export function ReadTicker({ onNewRead }: ReadTickerProps) {
  const [plates, setPlates] = useState<PlateCard[]>(generateInitialPlates());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPlate: PlateCard = {
        id: Date.now().toString(),
        plate: generateRandomPlate(),
        state: ["CA", "TX", "NY", "FL", "WA", "OR"][Math.floor(Math.random() * 6)],
        camera: Math.random() > 0.5 ? "A" : "B",
        vehicle: [
          "Blue Toyota",
          "Silver Ford",
          "Black Honda",
          "White Chevrolet",
          "Red Nissan",
          "Gray Hyundai",
        ][Math.floor(Math.random() * 6)],
        confidence: Math.round((94 + Math.random() * 5.9) * 10) / 10,
        isNew: true,
      };

      setPlates((prev) => {
        const updated = [newPlate, ...prev.map((p) => ({ ...p, isNew: false }))].slice(0, 14);
        return updated;
      });

      onNewRead?.();

      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[110px] bg-[var(--bg-1)] border-t border-[var(--line)] flex flex-col">
      {/* Header row */}
      <div className="px-4 pt-2.5 pb-1.5 border-b border-[var(--line)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase text-[10px] tracking-[.16em] text-[var(--text-2)]">
            LIVE READ STREAM
          </span>
          <span className="font-mono text-[10px] font-semibold text-[var(--accent)]">
            · 47/min
          </span>
        </div>
        <div className="font-mono text-[10px] text-[var(--text-3)]">
          Avg session: <span className="font-semibold text-[var(--text-1)]">52 plates / min</span> ·
          Last 60s: <span className="font-semibold text-[var(--text-1)]">47</span>
        </div>
      </div>

      {/* Card strip */}
      <div
        ref={scrollRef}
        className="flex-1 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {plates.map((plate) => (
          <PlateCard key={plate.id} plate={plate} />
        ))}
      </div>
    </div>
  );
}

function PlateCard({ plate }: { plate: PlateCard }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[110px] border border-[var(--line)] rounded-md p-1.5 relative"
      style={{
        background: plate.isNew ? "rgba(0,229,212,.08)" : "var(--bg-2)",
      }}
      initial={plate.isNew ? { x: -20, opacity: 0 } : false}
      animate={
        plate.isNew
          ? {
              x: 0,
              opacity: 1,
              background: ["rgba(0,229,212,.08)", "var(--bg-2)"],
            }
          : {}
      }
      transition={{ duration: 0.8 }}
    >
      {/* Plate */}
      <div className="font-mono text-[13px] font-bold tracking-[.04em] text-[var(--text-0)] leading-tight">
        {plate.plate}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-1 mb-0.5">
        <span className="font-mono text-[9px] text-[var(--text-2)]">{plate.state}</span>
        <span className="font-mono text-[9px] text-[var(--accent)]">CAM {plate.camera}</span>
      </div>

      {/* Vehicle */}
      <div className="text-[10px] text-[var(--text-2)] truncate">{plate.vehicle}</div>

      {/* Confidence */}
      <div
        className="font-mono text-[9px] font-semibold mt-0.5"
        style={{ color: plate.confidence >= 99 ? "var(--good)" : "var(--text-2)" }}
      >
        {plate.confidence}%
      </div>
    </motion.div>
  );
}

function generateInitialPlates(): PlateCard[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `initial-${i}`,
    plate: generateRandomPlate(),
    state: ["CA", "TX", "NY", "FL", "WA", "OR"][Math.floor(Math.random() * 6)],
    camera: Math.random() > 0.5 ? ("A" as const) : ("B" as const),
    vehicle: [
      "Blue Toyota",
      "Silver Ford",
      "Black Honda",
      "White Chevrolet",
      "Red Nissan",
      "Gray Hyundai",
    ][Math.floor(Math.random() * 6)],
    confidence: Math.round((94 + Math.random() * 5.9) * 10) / 10,
    isNew: false,
  }));
}

function generateRandomPlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const format = Math.random() > 0.5 ? "AAA 1111" : "1AAA111";

  return format
    .split("")
    .map((char) => {
      if (char === "A") return letters[Math.floor(Math.random() * letters.length)];
      if (char === "1") return numbers[Math.floor(Math.random() * numbers.length)];
      return char;
    })
    .join("");
}
