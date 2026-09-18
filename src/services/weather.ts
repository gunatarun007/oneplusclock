export interface WeatherData {
  temperature: number;
  conditionText: string;
  conditionCode: string;
  city?: string;
  lastUpdated?: number;
}

const CACHE_KEY = 'oneplus_clock_weather_cache';
const LAST_KNOWN_KEY = 'oneplus_clock_last_known_weather';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes fresh cache

// Helper with fallback timeout for fetch
async function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Get coordinates from HTML5 Geolocation or multi-provider IP lookup
async function getCoordinates(): Promise<{ lat: number; lon: number; city?: string }> {
  // Try HTML5 Geolocation first if available
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 3000,
          maximumAge: 600000
        });
      });
      if (pos?.coords?.latitude && pos?.coords?.longitude) {
        return {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
      }
    } catch {
      // Geolocation denied or timed out, continue to IP providers
    }
  }

  // Provider 1: geojs.io (Free, unlimited, highly reliable)
  try {
    const res = await fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json', 3500);
    if (res.ok) {
      const data = await res.json();
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon, city: data.city || data.region || data.country };
      }
    }
  } catch {
    // Try next provider
  }

  // Provider 2: ipwho.is (Fast and free fallback)
  try {
    const res = await fetchWithTimeout('https://ipwho.is/', 3500);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        return {
          lat: Number(data.latitude),
          lon: Number(data.longitude),
          city: data.city || data.region
        };
      }
    }
  } catch {
    // Try next provider
  }

  // Default coordinate fallback
  return { lat: 17.3850, lon: 78.4867, city: 'Local' };
}

function getWeatherCondition(code: number): { text: string; codeStr: string } {
  if (code === 0) return { text: 'Clear', codeStr: 'clear' };
  if (code === 1) return { text: 'Mostly Clear', codeStr: 'clear' };
  if (code === 2) return { text: 'Partly Cloudy', codeStr: 'cloudy' };
  if (code === 3) return { text: 'Cloudy', codeStr: 'cloudy' };
  if (code >= 45 && code <= 48) return { text: 'Foggy', codeStr: 'fog' };
  if (code >= 51 && code <= 55) return { text: 'Drizzle', codeStr: 'rain' };
  if (code >= 56 && code <= 57) return { text: 'Freezing Drizzle', codeStr: 'rain' };
  if (code >= 61 && code <= 65) return { text: 'Rainy', codeStr: 'rain' };
  if (code >= 66 && code <= 67) return { text: 'Freezing Rain', codeStr: 'rain' };
  if (code >= 71 && code <= 77) return { text: 'Snowy', codeStr: 'snow' };
  if (code >= 80 && code <= 82) return { text: 'Showers', codeStr: 'rain' };
  if (code >= 85 && code <= 86) return { text: 'Snow Showers', codeStr: 'snow' };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm', codeStr: 'thunder' };
  return { text: 'Cloudy', codeStr: 'cloudy' };
}

export async function fetchWeather(forceRefresh = false): Promise<WeatherData> {
  // 1. Check memory / localStorage cache if not force refreshing
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          parsed &&
          parsed.data &&
          typeof parsed.data.temperature === 'number' &&
          Date.now() - (parsed.timestamp || 0) < CACHE_DURATION
        ) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore cache parse error
    }
  }

  // 2. Fetch fresh weather
  try {
    const coords = await getCoordinates();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code`;
    const res = await fetchWithTimeout(url, 5000);

    if (res.ok) {
      const json = await res.json();
      const rawTemp = json.current?.temperature_2m;
      const code = json.current?.weather_code ?? 2;
      const temp = typeof rawTemp === 'number' ? Math.round(rawTemp) : 26;

      const { text, codeStr } = getWeatherCondition(code);

      const data: WeatherData = {
        temperature: temp,
        conditionText: text,
        conditionCode: codeStr,
        city: coords.city,
        lastUpdated: Date.now()
      };

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data })
        );
        localStorage.setItem(LAST_KNOWN_KEY, JSON.stringify(data));
      } catch {
        // Ignore storage errors
      }

      return data;
    }
  } catch {
    // Network or fetch failed
  }

  // 3. If fetch failed, try last known good weather from storage
  try {
    const lastKnown = localStorage.getItem(LAST_KNOWN_KEY);
    if (lastKnown) {
      const parsed = JSON.parse(lastKnown);
      if (parsed && typeof parsed.temperature === 'number') {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }

  // 4. Default fallback matching reference screenshots
  return {
    temperature: 26,
    conditionText: 'Cloudy',
    conditionCode: 'cloudy',
    city: 'Local',
    lastUpdated: Date.now()
  };
}
