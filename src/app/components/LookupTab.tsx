import { useState } from "react";
import { Search } from "lucide-react";

const MONO = "'Geist Mono', 'Monaco', monospace";

const MAKES      = ["Any", "Ford", "Chevrolet", "Toyota", "Honda", "Dodge", "GMC", "BMW", "Mercedes", "Nissan"];
const COLORS     = ["Any", "White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Yellow"];
const BODY_TYPES = ["Any", "Pickup", "SUV", "Sedan", "Coupe", "Van", "Truck"];

interface Result {
  plate: string; state: string; vehicle: string; confidence: number; camera: "A" | "B"; time: string;
}

const MOCK_RESULTS: Result[] = [
  { plate: "JLW8931", state: "TX", vehicle: "Silver Ford F-150 · 2014", confidence: 99.7, camera: "A", time: "14:23:45" },
  { plate: "JLW8931", state: "TX", vehicle: "Silver Ford F-150 · 2014", confidence: 98.9, camera: "A", time: "14:22:11" },
  { plate: "JLW8931", state: "TX", vehicle: "Silver Ford F-150 · 2014", confidence: 97.3, camera: "B", time: "14:19:04" },
];

export function LookupTab() {
  const [plate, setPlate] = useState("");
  const [partial, setPartial] = useState(false);
  const [make, setMake] = useState("Any");
  const [color, setColor] = useState("Any");
  const [bodyType, setBodyType] = useState("Any");
  const [timeRange, setTimeRange] = useState("1h");
  const [radius, setRadius] = useState("2");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 600);
  };

  const results = plate.toLowerCase().includes("jlw") || plate === "" ? MOCK_RESULTS : [];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-0)" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)", flexShrink: 0 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-1)" }}>
          Manual Plate Lookup
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }} className="scrollbar-thin">
        {/* Plate query */}
        <Block title="Plate Query">
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder={partial ? "e.g. JLW* or *8931" : "e.g. JLW8931"}
              style={{ flex: 1, padding: "10px 14px", background: "var(--bg-2)", border: "1px solid var(--line-2)", color: "var(--text-0)", fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-2)")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              style={{ padding: "10px 20px", background: "var(--accent)", border: "none", color: "var(--bg-0)", fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Search size={14} />
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={partial} onChange={(e) => setPartial(e.target.checked)} style={{ accentColor: "var(--accent)", width: 14, height: 14 }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Partial match / wildcard
            </span>
          </label>
        </Block>

        {/* Vehicle fingerprint search */}
        <Block title="Vehicle Fingerprint Search">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <FilterSelect label="Make" value={make} options={MAKES} onChange={setMake} />
            <FilterSelect label="Color" value={color} options={COLORS} onChange={setColor} />
            <FilterSelect label="Body Type" value={bodyType} options={BODY_TYPES} onChange={setBodyType} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Time Range</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["30m", "1h", "4h", "Shift"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    style={{ flex: 1, padding: "7px 0", background: timeRange === t ? "var(--bg-3)" : "var(--bg-2)", border: timeRange === t ? "1px solid var(--accent)" : "1px solid var(--line-2)", color: timeRange === t ? "var(--accent)" : "var(--text-2)", fontFamily: MONO, fontSize: 9, fontWeight: 600, cursor: "pointer", letterSpacing: "0.08em" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                Radius from unit: <span style={{ color: "var(--text-1)" }}>{radius} mi</span>
              </div>
              <input
                type="range" min="0.5" max="10" step="0.5" value={radius}
                onChange={(e) => setRadius(e.target.value)}
                style={{ width: "100%", accentColor: "var(--accent)", height: 4 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontFamily: MONO, fontSize: 8, color: "var(--text-3)" }}>0.5 mi</span>
                <span style={{ fontFamily: MONO, fontSize: 8, color: "var(--text-3)" }}>10 mi</span>
              </div>
            </div>
          </div>
        </Block>

        {/* Results */}
        {searched && (
          <Block title={`Results · ${results.length} reads found`} titleRight={results.length > 0 ? <span style={{ color: "var(--accent)", fontFamily: MONO, fontSize: 9 }}>{results.length} found</span> : undefined}>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", fontFamily: MONO, fontSize: 11, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                No records found
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 52px 56px 64px", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--line)", marginBottom: 4 }}>
                  {["PLATE / VEHICLE", "TIME", "STATE", "CAM", "CONF"].map((h) => (
                    <div key={h} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>{h}</div>
                  ))}
                </div>
                {results.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 52px 56px 64px", gap: 12, padding: "10px 0", borderBottom: i < results.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "var(--text-0)", marginBottom: 2 }}>{r.plate}</div>
                      <div style={{ fontSize: 11, color: "var(--text-2)" }}>{r.vehicle}</div>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-2)" }}>{r.time}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-2)" }}>{r.state}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--accent)" }}>CAM {r.camera}</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: r.confidence >= 99 ? "var(--good)" : "var(--text-1)" }}>{r.confidence}%</div>
                  </div>
                ))}
              </div>
            )}
          </Block>
        )}
      </div>
    </div>
  );
}

function Block({ title, titleRight, children }: { title: string; titleRight?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", background: "var(--bg-1)" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-2)" }}>{title}</span>
        {titleRight}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 10px", background: "var(--bg-2)", border: "1px solid var(--line-2)", color: "var(--text-0)", fontFamily: MONO, fontSize: 11, cursor: "pointer", outline: "none" }}
      >
        {options.map((o) => <option key={o} value={o} style={{ background: "var(--bg-2)" }}>{o}</option>)}
      </select>
    </div>
  );
}
