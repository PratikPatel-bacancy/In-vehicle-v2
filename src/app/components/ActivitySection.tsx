import { Filter, Download } from "lucide-react";

interface ActivityRow {
  time: string;
  plate: string;
  vehicle: string;
  state: string;
  camera: "A" | "B";
  isHit?: boolean;
}

const activityData: ActivityRow[] = [
  {
    time: "14:23:45",
    plate: "JLW8931",
    vehicle: "Silver Ford F-150",
    state: "TX",
    camera: "A",
    isHit: true,
  },
  {
    time: "14:21:12",
    plate: "8KAM415",
    vehicle: "Blue Toyota Camry",
    state: "CA",
    camera: "B",
  },
  {
    time: "14:18:33",
    plate: "LMN5432",
    vehicle: "White Chevrolet Silverado",
    state: "TX",
    camera: "A",
  },
  {
    time: "14:15:09",
    plate: "QRS7890",
    vehicle: "Red Chevrolet Tahoe",
    state: "TX",
    camera: "B",
  },
  {
    time: "14:12:47",
    plate: "TUV2468",
    vehicle: "Blue Nissan Altima",
    state: "OK",
    camera: "A",
  },
  {
    time: "14:09:21",
    plate: "WXY1357",
    vehicle: "Gray BMW X5",
    state: "TX",
    camera: "B",
  },
  {
    time: "14:06:55",
    plate: "DEF2468",
    vehicle: "Black Mercedes C300",
    state: "TX",
    camera: "A",
  },
  {
    time: "14:03:12",
    plate: "GHI9753",
    vehicle: "White Tesla Model 3",
    state: "TX",
    camera: "B",
  },
  {
    time: "14:00:41",
    plate: "JKL4826",
    vehicle: "Silver Honda Civic",
    state: "TX",
    camera: "A",
  },
  {
    time: "13:58:17",
    plate: "MNO1593",
    vehicle: "Blue Ford Escape",
    state: "NM",
    camera: "B",
  },
  {
    time: "13:55:33",
    plate: "PQR7531",
    vehicle: "Black Dodge Ram",
    state: "TX",
    camera: "A",
  },
  {
    time: "13:52:08",
    plate: "STU8642",
    vehicle: "White Hyundai Sonata",
    state: "TX",
    camera: "B",
  },
];

interface ActivitySectionProps {
  onTriggerHit?: () => void;
}

export function ActivitySection({ onTriggerHit }: ActivitySectionProps) {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-1)] overflow-hidden">
      {/* Section header */}
      <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase text-[10px] font-semibold text-[var(--text-0)]">
            RECENT ACTIVITY
          </span>
          <div className="px-2 py-0.5 rounded-full bg-[var(--bg-3)] text-[var(--accent)] font-mono text-[10px] font-semibold">
            142
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-[26px] h-[26px] bg-[var(--bg-2)] border border-[var(--line-2)] rounded flex items-center justify-center hover:border-[var(--accent)] transition-colors">
            <Filter size={14} className="text-[var(--text-2)]" />
          </button>
          <button className="w-[26px] h-[26px] bg-[var(--bg-2)] border border-[var(--line-2)] rounded flex items-center justify-center hover:border-[var(--accent)] transition-colors">
            <Download size={14} className="text-[var(--text-2)]" />
          </button>
        </div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5 scrollbar-thin">
        {activityData.map((row, idx) => (
          <ActivityRowItem key={idx} row={row} onTriggerHit={row.isHit ? onTriggerHit : undefined} />
        ))}
      </div>
    </div>
  );
}

function ActivityRowItem({ row, onTriggerHit }: { row: ActivityRow; onTriggerHit?: () => void }) {
  return (
    <div
      onClick={onTriggerHit}
      className={`grid grid-cols-[56px_1fr_48px] gap-3 px-2.5 py-2.5 rounded-md border-l-2 transition-colors cursor-pointer ${
        row.isHit
          ? "border-l-[var(--hit)] bg-[rgba(255,51,85,.06)] hover:bg-[rgba(255,51,85,.1)]"
          : "border-l-transparent hover:bg-[var(--bg-2)]"
      }`}
    >
      {/* Time column */}
      <div className="font-mono text-[11px] text-[var(--text-2)]">{row.time}</div>

      {/* Info column */}
      <div>
        {/* Plate row */}
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`font-mono text-[13px] font-bold ${
              row.isHit ? "text-[var(--hit)]" : "text-[var(--text-0)]"
            }`}
          >
            {row.plate}
          </span>
          {row.isHit && (
            <span className="px-1.5 py-0.5 rounded-sm bg-[var(--hit)] text-white text-[8px] font-mono font-semibold tracking-[.12em]">
              HOTLIST
            </span>
          )}
        </div>
        {/* Vehicle subline */}
        <div className="text-[11px] text-[var(--text-2)]">
          {row.vehicle} · {row.state}
        </div>
      </div>

      {/* Camera column */}
      <div className="font-mono text-[10px] text-[var(--text-3)] flex items-start">
        CAM {row.camera}
      </div>

    </div>
  );
}
