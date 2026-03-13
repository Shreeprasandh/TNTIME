import { useState, useEffect } from 'react';

export function useLiveEvents(pollIntervalMs = 15000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let timeoutId;
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/events/live', {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json.data); // json.data contains the FeatureCollection
        setLastUpdated(new Date());
        setError(null);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Live feed fetch error:", e);
          setError(e.message);
        }
      } finally {
        setLoading(false);
        timeoutId = setTimeout(fetchEvents, pollIntervalMs);
      }
    };

    fetchEvents();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [pollIntervalMs]);

  return { data, loading, error, lastUpdated };
}
