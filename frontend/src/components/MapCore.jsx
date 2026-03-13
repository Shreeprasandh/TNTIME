import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// ─── Tamil Nadu Bounding Box ─────────────────────────────────
const TN_BOUNDS = [[76.15, 8.07], [80.34, 13.56]];

// ─── MapLibre Style: CARTO Dark Matter (no API key needed) ───
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapCore({ onMapReady }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // already initialised

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      bounds: TN_BOUNDS,
      fitBoundsOptions: { padding: 40 },
      maxBounds: [
        [TN_BOUNDS[0][0] - 0.5, TN_BOUNDS[0][1] - 0.5],
        [TN_BOUNDS[1][0] + 0.5, TN_BOUNDS[1][1] + 0.5],
      ],
      minZoom: 6,
      maxZoom: 14,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // ── Add inverted spotlight mask ──────────────────────────
      map.addSource('tn-mask', {
        type: 'geojson',
        data: '/tn-mask.geojson',
      });

      // Dark fill over everything outside TN
      map.addLayer({
        id: 'tn-mask-fill',
        type: 'fill',
        source: 'tn-mask',
        paint: {
          'fill-color': '#000005',
          'fill-opacity': 0.82,
        },
      });

      // Neon green inner border glow around TN
      map.addLayer({
        id: 'tn-border-glow-outer',
        type: 'line',
        source: 'tn-mask',
        paint: {
          'line-color': 'rgba(57, 255, 20, 0.15)',
          'line-width': 6,
          'line-blur': 4,
        },
        filter: ['==', '$type', 'Polygon'],
      });

      map.addLayer({
        id: 'tn-border-line',
        type: 'line',
        source: 'tn-mask',
        paint: {
          'line-color': 'rgba(57, 255, 20, 0.55)',
          'line-width': 1.2,
        },
        filter: ['==', '$type', 'Polygon'],
      });

      if (onMapReady) onMapReady(map);
    });

    // Prevent right-click context menu on map
    containerRef.current.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onMapReady]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      id="map-container"
    />
  );
}
