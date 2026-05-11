import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";

const CAR_IMAGES = [
  { src: "/cameras/cam-a-f150.png",           plate: "JLW8931", state: "TX" },
  { src: "/cameras/cam-b-camry.png",          plate: "8SAM415", state: "CA" },
  { src: "/cameras/cam-disabled.png",         plate: "G739KL",  state: "FL" },
  { src: "/cameras/cam-camry-blue-sunset.jpeg", plate: "8SAM415", state: "CA" },
  { src: "/cameras/cam-camry-blue-street.jpeg", plate: "8SAM415", state: "CA" },
  { src: "/cameras/cam-honda-accord-a.jpeg",  plate: "4TRK209", state: "CA" },
  { src: "/cameras/cam-honda-accord-b.jpeg",  plate: "4TRK209", state: "CA" },
  { src: "/cameras/cam-ford-fusion-a.jpeg",   plate: "1NYC732", state: "CA" },
  { src: "/cameras/cam-ford-fusion-b.jpeg",   plate: "1NYC732", state: "CA" },
  { src: "/cameras/cam-ford-fusion-c.jpeg",   plate: "1NYC732", state: "CA" },
];

interface PlateCard {
  id: string;
  plate: string;
  state: string;
  camera: "A" | "B";
  imgIdx: number;
  isNew: boolean;
}

interface ReadTickerProps {
  onNewRead?: () => void;
}

const CARD_STEP = 136; // 128px card + 8px gap

export function ReadTicker({ onNewRead }: ReadTickerProps) {
  const [plates, setPlates] = useState<PlateCard[]>(generateInitialPlates());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollBy = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? CARD_STEP * 3 : -CARD_STEP * 3, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPlate: PlateCard = {
        id: Date.now().toString(),
        plate: generateRandomPlate(),
        state: ["CA", "TX", "NY", "FL", "WA", "OR"][Math.floor(Math.random() * 6)],
        camera: Math.random() > 0.5 ? "A" : "B",
        imgIdx: Math.floor(Math.random() * CAR_IMAGES.length),
        isNew: true,
      };

      setPlates((prev) => {
        const updated = [newPlate, ...prev.map((p) => ({ ...p, isNew: false }))].slice(0, 40);
        return updated;
      });

      onNewRead?.();

      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
        setTimeout(updateScrollState, 100);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--bg-1)] border-t border-[var(--line)] flex flex-col" style={{ height: 150 }}>
      {/* Header row */}
      <div className="px-4 pt-2 pb-1.5 border-b border-[var(--line)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase text-[10px] tracking-[.16em] text-[var(--text-2)]">
            LIVE READ STREAM
          </span>
          <span className="font-mono text-[10px] font-semibold text-[var(--accent)]">
            · 47/min
          </span>
        </div>
        <div className="font-mono text-[10px] text-[var(--text-3)]">
          Avg session: <span className="font-semibold text-[var(--text-0)]">52 plates / min</span> ·
          Last 60s: <span className="font-semibold text-[var(--text-0)]">47</span>
        </div>
      </div>

      {/* Card strip + nav buttons */}
      <div className="flex-1 flex items-center min-w-0">

        {/* Prev button */}
        <button
          onClick={() => scrollBy("prev")}
          disabled={!canScrollLeft}
          className="flex-shrink-0 flex items-center justify-center transition-colors"
          style={{
            width: 32, height: "100%",
            background: canScrollLeft ? "var(--bg-2)" : "transparent",
            borderRight: "1px solid var(--line)",
            color: canScrollLeft ? "var(--accent)" : "var(--text-3)",
            cursor: canScrollLeft ? "pointer" : "default",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex-1 h-full px-2 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {plates.map((plate) => (
            <ThumbnailCard key={plate.id} plate={plate} />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => scrollBy("next")}
          disabled={!canScrollRight}
          className="flex-shrink-0 flex items-center justify-center transition-colors"
          style={{
            width: 32, height: "100%",
            background: canScrollRight ? "var(--bg-2)" : "transparent",
            borderLeft: "1px solid var(--line)",
            color: canScrollRight ? "var(--accent)" : "var(--text-3)",
            cursor: canScrollRight ? "pointer" : "default",
          }}
        >
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
}

function ThumbnailCard({ plate }: { plate: PlateCard }) {
  const img = CAR_IMAGES[plate.imgIdx];

  return (
    <motion.div
      className="flex-shrink-0 relative overflow-hidden border"
      style={{
        width: 128,
        height: 96,
        borderColor: plate.isNew ? "var(--accent)" : "var(--line)",
        boxShadow: plate.isNew ? "0 0 8px var(--accent-glow)" : "none",
      }}
      initial={plate.isNew ? { x: -30, opacity: 0 } : false}
      animate={plate.isNew ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Real camera image */}
      <img
        src={img.src}
        alt="scanned vehicle"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)" }}
      />

      {/* New-read cyan flash overlay */}
      {plate.isNew && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          style={{ background: "var(--accent)", mixBlendMode: "screen" }}
        />
      )}

      {/* Camera label — top left */}
      <div
        className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5"
        style={{ background: "rgba(5,7,9,.75)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--accent)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span style={{ fontFamily: MONO, fontSize: 8, color: "var(--text-0)", letterSpacing: "0.08em" }}>
          CAM {plate.camera}
        </span>
      </div>

      {/* Plate + state overlay — bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1"
        style={{ background: "rgba(5,7,9,.82)", backdropFilter: "blur(4px)" }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "var(--text-0)", letterSpacing: "0.05em" }}>
          {img.plate}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-2)" }}>
          {img.state}
        </span>
      </div>
    </motion.div>
  );
}

function DashcamScene({ bodyColor, roofColor }: { bodyColor: string; roofColor: string }) {
  return (
    <svg width="128" height="96" viewBox="0 0 128 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="50%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id={`bodyGrad-${bodyColor}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={roofColor} />
          <stop offset="100%" stopColor={bodyColor} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="128" height="44" fill="url(#skyGrad)" />

      {/* Road */}
      <rect x="0" y="44" width="128" height="52" fill="url(#roadGrad)" />

      {/* Road perspective lines */}
      <line x1="64" y1="44" x2="10" y2="96" stroke="#4b5563" strokeWidth="1" opacity="0.5" />
      <line x1="64" y1="44" x2="118" y2="96" stroke="#4b5563" strokeWidth="1" opacity="0.5" />

      {/* Lane dashes */}
      <line x1="64" y1="52" x2="64" y2="60" stroke="white" strokeWidth="1.5" opacity="0.35" strokeDasharray="4,4" />
      <line x1="64" y1="66" x2="64" y2="74" stroke="white" strokeWidth="1.5" opacity="0.25" strokeDasharray="4,4" />

      {/* Car body */}
      <rect x="34" y="22" width="60" height="36" rx="3" fill={`url(#bodyGrad-${bodyColor})`} />

      {/* Windshield */}
      <rect x="39" y="25" width="50" height="14" rx="2" fill="#1a2030" opacity="0.85" />
      {/* Windshield glare */}
      <rect x="41" y="26" width="18" height="4" rx="1" fill="white" opacity="0.12" />

      {/* Roof */}
      <rect x="44" y="18" width="40" height="10" rx="3" fill={roofColor} />

      {/* Left taillight */}
      <rect x="34" y="38" width="8" height="12" rx="1" fill="#ff3333" opacity="0.9" />
      <rect x="34" y="38" width="8" height="5" rx="1" fill="#ff6666" opacity="0.6" />

      {/* Right taillight */}
      <rect x="86" y="38" width="8" height="12" rx="1" fill="#ff3333" opacity="0.9" />
      <rect x="86" y="38" width="8" height="5" rx="1" fill="#ff6666" opacity="0.6" />

      {/* Bumper */}
      <rect x="36" y="52" width="56" height="5" rx="1" fill="#1a1d22" />

      {/* License plate on car */}
      <rect x="50" y="53" width="28" height="7" rx="1" fill="#f0f0e8" />
      <rect x="50" y="53" width="28" height="2.5" rx="1" fill="#c0392b" />

      {/* Left wheel */}
      <ellipse cx="42" cy="58" rx="6" ry="4" fill="#111" />
      <ellipse cx="42" cy="58" rx="3" ry="2" fill="#333" />

      {/* Right wheel */}
      <ellipse cx="86" cy="58" rx="6" ry="4" fill="#111" />
      <ellipse cx="86" cy="58" rx="3" ry="2" fill="#333" />

      {/* Ground shadow */}
      <ellipse cx="64" cy="64" rx="38" ry="6" fill="black" opacity="0.25" />
    </svg>
  );
}

function generateInitialPlates(): PlateCard[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `initial-${i}`,
    plate: generateRandomPlate(),
    state: ["CA", "TX", "NY", "FL", "WA", "OR"][Math.floor(Math.random() * 6)],
    camera: Math.random() > 0.5 ? ("A" as const) : ("B" as const),
    imgIdx: Math.floor(Math.random() * CAR_IMAGES.length),
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
