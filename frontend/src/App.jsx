import { useRef, useState, useCallback, useEffect } from 'react';
import MapCore from './components/MapCore';
import './index.css';

// ─── Live Clock ───────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();

  return (
    <div className="text-right">
      <div className="readout-lg text-neon text-lg tracking-widest animate-flicker">
        {formatted}
        <span className="animate-blink-cursor ml-0.5">_</span>
      </div>
      <div className="readout text-neon-slate mt-0.5">{dateStr}</div>
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="flex items-center gap-3">
      <span className="ticker-dot" />
      <span className="readout text-neon tracking-widest uppercase text-xs">
        LIVE FEED ACTIVE
      </span>
      <span className="readout text-muted">|</span>
      <span className="readout text-neon-slate text-xs">TN-AOI LOCKED</span>
      <span className="readout text-muted">|</span>
      <span className="readout text-neon-slate text-xs">
        {new Date().getFullYear()} TNTIME v1.0
      </span>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────
function Header() {
  return (
    <header
      className="glass-panel absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
      style={{ borderBottom: '1px solid rgba(57,255,20,0.2)' }}
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span
            className="readout-lg text-neon text-xl font-bold tracking-[0.2em] uppercase animate-flicker"
            style={{ textShadow: '0 0 20px rgba(57,255,20,0.9), 0 0 40px rgba(57,255,20,0.4)' }}
          >
            ⚡ TNTIME
          </span>
          <span className="readout text-neon-slate text-[10px] tracking-[0.3em] uppercase mt-0.5">
            Tamil Nadu Situational Awareness
          </span>
        </div>

        {/* INDIA / TN Badge */}
        <div
          className="ml-4 px-2 py-1 rounded-sm border"
          style={{
            borderColor: 'rgba(255,42,42,0.5)',
            backgroundColor: 'rgba(255,42,42,0.08)',
          }}
        >
          <span className="readout text-crimson text-[10px] tracking-widest font-bold">
            IN-TN / ADM1: IN25
          </span>
        </div>
      </div>

      {/* Center: Status */}
      <StatusBar />

      {/* Right: Clock */}
      <Clock />
    </header>
  );
}

// ─── Coordinate Display ───────────────────────────────────────
function CoordDisplay({ coords }) {
  if (!coords) return null;
  return (
    <div
      className="glass-panel absolute bottom-4 right-4 z-30 px-3 py-2 rounded-sm"
      style={{ minWidth: 200 }}
    >
      <div className="readout text-neon-slate text-[10px] mb-1 uppercase tracking-widest">
        Cursor Position
      </div>
      <div className="readout text-neon text-xs">
        {coords.lng.toFixed(5)}°E &nbsp;/&nbsp; {coords.lat.toFixed(5)}°N
      </div>
    </div>
  );
}

// ─── Map Legend ───────────────────────────────────────────────
function Legend() {
  const categories = [
    { label: 'POLITICS',  color: '#ff2a2a', glyph: '◆' },
    { label: 'ACCIDENT',  color: '#ffdd00', glyph: '◆' },
    { label: 'WEATHER',   color: '#00e5ff', glyph: '◆' },
    { label: 'CRIME',     color: '#ff6600', glyph: '◆' },
    { label: 'OTHER',     color: '#94a3b8', glyph: '◆' },
  ];
  return (
    <div
      className="glass-panel absolute bottom-4 left-4 z-30 px-4 py-3 rounded-sm"
      style={{ minWidth: 170 }}
    >
      <div className="readout text-neon-slate text-[10px] mb-2 uppercase tracking-widest border-b border-steel pb-1">
        EVENT CATEGORIES
      </div>
      <div className="flex flex-col gap-1.5">
        {categories.map(({ label, color, glyph }) => (
          <div key={label} className="flex items-center gap-2">
            <span style={{ color, textShadow: `0 0 6px ${color}`, fontSize: 8 }}>
              {glyph}
            </span>
            <span
              className="readout text-[11px] tracking-wider"
              style={{ color: color + 'cc' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  const mapRef = useRef(null);
  const [cursorCoords, setCursorCoords] = useState(null);

  const handleMapReady = useCallback((map) => {
    mapRef.current = map;

    map.on('mousemove', (e) => {
      setCursorCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    map.on('mouseleave', () => {
      setCursorCoords(null);
    });
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden scan-overlay"
      style={{ background: '#000000' }}
    >
      {/* Ambient vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <MapCore onMapReady={handleMapReady} />
      </div>

      {/* UI Chrome */}
      <Header />
      <Legend />
      <CoordDisplay coords={cursorCoords} />

      {/* Phase 3 Sidebar slot - placeholder */}
      {/* <Sidebar /> */}
    </div>
  );
}
