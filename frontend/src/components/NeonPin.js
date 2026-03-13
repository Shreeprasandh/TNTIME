import maplibregl from 'maplibre-gl';

const CATEGORY_COLORS = {
  POLITICS: '#ff4444',     // Red
  ACCIDENT: '#facc15',     // Yellow
  WEATHER: '#38bdf8',      // Blue
  CRIME: '#fb923c',        // Orange
  INFRASTRUCTURE: '#94a3b8',// Slate
  OTHER: '#a3a3a3'         // Gray
};

export function createNeonPin(feature, map) {
  const { category, title, district, sourceUrl, severity } = feature.properties;
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
  
  // Create the container DOM element for the marker
  const el = document.createElement('div');
  el.className = 'neon-pin-container cursor-pointer relative flex items-center justify-center';
  el.style.width = '24px';
  el.style.height = '24px';

  // Inner dot
  const dot = document.createElement('div');
  dot.className = 'w-2.5 h-2.5 rounded-full z-10';
  dot.style.backgroundColor = color;
  dot.style.boxShadow = `0 0 8px ${color}`;

  // Outer pulsing ring
  const ring = document.createElement('div');
  ring.className = 'absolute inset-0 rounded-full z-0 animate-ping opacity-75';
  ring.style.backgroundColor = color;
  
  // High severity gets faster pulse
  if (severity === 'HIGH') {
    ring.style.animationDuration = '1s';
    dot.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}`;
  } else {
    ring.style.animationDuration = '2s';
  }

  el.appendChild(ring);
  el.appendChild(dot);

  // Outline/border to make it pop against the dark map
  const border = document.createElement('div');
  border.className = 'absolute w-3.5 h-3.5 rounded-full border border-black z-20';
  el.appendChild(border);

  // Popup Content
  const popupHtml = `
    <div class="bg-[#050505] border border-gray-800 p-2 min-w-[200px] text-gray-200 shadow-2xl">
      <div class="flex items-center gap-2 mb-1.5 border-b border-gray-800 pb-1.5">
        <div class="w-2 h-2 rounded-full" style="background-color: ${color}; box-shadow: 0 0 4px ${color}"></div>
        <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">${category}</span>
        ${severity === 'HIGH' ? '<span class="text-[8px] px-1 bg-red-900/50 text-red-400 ml-auto border border-red-900">HIGH PRIORITY</span>' : ''}
      </div>
      <h3 class="text-xs font-medium leading-snug mb-2">${title}</h3>
      <div class="flex justify-between items-center text-[9px] text-gray-500 font-mono">
        <span>📍 ${district || 'TN Area'}</span>
        <a href="${sourceUrl}" target="_blank" rel="noreferrer" class="text-neon-slate hover:text-white transition-colors">SOURCE ↗</a>
      </div>
    </div>
  `;

  const popup = new maplibregl.Popup({ offset: 12, closeButton: false, className: 'war-room-popup' })
    .setHTML(popupHtml);

  return new maplibregl.Marker({ element: el })
    .setLngLat(feature.geometry.coordinates)
    .setPopup(popup);
}
