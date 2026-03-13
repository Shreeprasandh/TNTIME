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
    <div className="flex flex-col items-end justify-center">
      <div className="readout-lg text-neon text-xs tracking-widest animate-flicker">
        {formatted}
        <span className="animate-blink-cursor ml-0.5">_</span>
      </div>
      <div className="readout text-neon-slate text-[9px] mt-[1px]">{dateStr}</div>
    </div>
  );
}

// ─── Global Status Indicators ─────────────────────────────────
function GlobalStatus() {
  return (
    <div className="flex items-center gap-4 border border-gray-800 px-3 py-1 rounded bg-[#0a0a0a]">
      <div className="flex items-center gap-2">
        <span className="ticker-dot w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_4px_#39ff14] animate-pulse-glow" />
        <span className="readout text-neon text-[10px] tracking-widest uppercase">
          LIVE FEED
        </span>
      </div>
      <span className="readout text-gray-700">|</span>
      <span className="readout text-neon-slate text-[10px] uppercase">
        TN-AOI LOCKED
      </span>
      <span className="readout text-gray-700">|</span>
      <span className="readout text-crimson text-[10px] font-bold tracking-widest uppercase">
        ADM1: IN25
      </span>
    </div>
  );
}

// ─── Top Navigation Bar ───────────────────────────────────────
function TopNav() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-gray-800 bg-[#060606] z-20">
      {/* Left: Branding */}
      <div className="flex flex-col justify-center">
        <span
          className="readout-lg text-neon font-bold tracking-[0.2em] uppercase text-sm animate-flicker"
          style={{ textShadow: '0 0 10px rgba(57,255,20,0.6)' }}
        >
          ⚡ TNTIME
        </span>
        <span className="readout text-neon-slate text-[8px] tracking-[0.2em] uppercase mt-[1px]">
          Tamil Nadu Situational Awareness
        </span>
      </div>

      {/* Center: Status */}
      <GlobalStatus />

      {/* Right: Clock */}
      <Clock />
    </header>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────
function LeftSidebar() {
  const layers = [
    { label: 'POLITICS', color: 'bg-[#ff2a2a]' },
    { label: 'ACCIDENTS', color: 'bg-[#ffdd00]' },
    { label: 'WEATHER', color: 'bg-[#00e5ff]' },
    { label: 'CRIME', color: 'bg-[#ff6600]' },
    { label: 'INFRASTRUCTURE', color: 'bg-[#94a3b8]' }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-800 bg-[#080808] flex flex-col z-10">
      <div className="p-3 border-b border-gray-800 bg-[#0a0a0a]">
        <h2 className="readout text-neon-slate text-[10px] uppercase tracking-widest">
          SEARCH LAYERS
        </h2>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {layers.map((layer) => (
            <label key={layer.label} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-3 h-3 border border-gray-700 bg-[#0a0a0a] group-hover:border-neon-slate transition-colors">
                <input type="checkbox" defaultChecked className="opacity-0 absolute inset-0 cursor-pointer" />
                {/* Custom checkmark/dot */}
                <div className={`w-1.5 h-1.5 ${layer.color} shadow-[0_0_4px_currentColor]`} />
              </div>
              <span className="readout text-gray-300 text-[10px] tracking-wider group-hover:text-white transition-colors">
                {layer.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Bottom Dock ──────────────────────────────────────────────
function BottomDock() {
  return (
    <footer className="h-64 shrink-0 border-t border-gray-800 bg-[#080808] grid grid-cols-3 divide-x divide-gray-800 z-20">
      {/* Col 1: Live News Feed */}
      <section className="flex flex-col overflow-hidden">
        <div className="p-2 border-b border-gray-800 bg-[#0a0a0a]">
          <h2 className="readout text-neon-slate text-[10px] uppercase tracking-widest flex items-center justify-between">
            <span>LIVE NEWS</span>
            <span className="text-neon animate-pulse">● REC</span>
          </h2>
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
          {/* Placeholders */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="readout text-[10px] text-gray-400 border-l-2 border-gray-700 pl-2 py-1">
              <span className="text-gray-600 block mb-1">-[10:42:0{i}]-</span>
              Awaiting real-time stream data from backend services...
            </div>
          ))}
        </div>
      </section>

      {/* Col 2: Live Webcams */}
      <section className="flex flex-col overflow-hidden">
        <div className="p-2 border-b border-gray-800 bg-[#0a0a0a]">
          <h2 className="readout text-neon-slate text-[10px] uppercase tracking-widest flex items-center justify-between">
            <span>LIVE WEBCAMS</span>
            <span className="text-muted text-[8px]">4 FEEDS</span>
          </h2>
        </div>
        <div className="flex-1 p-3 grid grid-cols-2 grid-rows-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-800 bg-[#040404] flex items-center justify-center relative group">
              <span className="readout text-gray-800 text-[9px] uppercase">SIGNAL LOST</span>
              <div className="absolute top-1 right-1 w-1 h-1 bg-red-900 rounded-full" />
              <div className="absolute bottom-1 left-1 readout text-[8px] text-gray-700">CAM-0{i}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Col 3: AI Insights */}
      <section className="flex flex-col overflow-hidden">
        <div className="p-2 border-b border-gray-800 bg-[#0a0a0a]">
          <h2 className="readout text-neon-slate text-[10px] uppercase tracking-widest flex items-center gap-2">
            <span>AI INSIGHTS</span>
            <span className="px-1 bg-[#1a1a24] border border-[#2a2a3a] text-neon-cyan text-[8px]">ANALYSING</span>
          </h2>
        </div>
        <div className="flex-1 p-3">
          <div className="readout text-[10px] text-neon-cyan leading-relaxed" style={{ textShadow: '0 0 4px rgba(0,229,255,0.3)' }}>
            <span className="animate-blink-cursor">_</span> System initialized. Awaiting critical threshold breaches across TN sub-districts. No anomalies detected in current cycle.
          </div>
        </div>
      </section>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
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

  // Ensure map resizes correctly if the window or layout flexbox changes
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-[#0a0a0a] text-gray-200 overflow-hidden select-none">
      
      {/* 1. Top Navigation Bar */}
      <TopNav />

      {/* 2. Main Middle Section */}
      <main className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Map Container */}
        <div 
          ref={containerRef}
          className="flex-1 relative bg-black border-r border-gray-800"
        >
          {/* Ambient vignette over map container only */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          <MapCore onMapReady={handleMapReady} />

          {/* Coordinate Overlay Floating on Map */}
          {cursorCoords && (
            <div className="absolute bottom-3 right-3 z-30 px-2 py-1 bg-[#050505] border border-gray-800 rounded-sm pointer-events-none">
              <div className="readout text-neon text-[9px]">
                {cursorCoords.lng.toFixed(5)}°E / {cursorCoords.lat.toFixed(5)}°N
              </div>
            </div>
          )}
        </div>

      </main>

      {/* 3. Bottom Dock */}
      <BottomDock />

    </div>
  );
}
