import React, { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useClock } from './hooks/useClock';
import { fetchWeather, WeatherData } from './services/weather';
import {
  SettingsModal,
  ClockSettings
} from './components/SettingsModal';

import { VariantHorizontal } from './components/variants/VariantHorizontal';
import { VariantVertical } from './components/variants/VariantVertical';
import { VariantDayClock } from './components/variants/VariantDayClock';
import { VariantClockWeatherSide } from './components/variants/VariantClockWeatherSide';
import { VariantCompact } from './components/variants/VariantCompact';
import { VariantLargeInfo } from './components/variants/VariantLargeInfo';
import { VariantVerticalWeather } from './components/variants/VariantVerticalWeather';

const SETTINGS_STORAGE_KEY = 'oneplus_clock_desktop_settings';

const DEFAULT_SETTINGS: ClockSettings = {
  variant: 'weather-side',
  use24Hour: true,
  showSeconds: false,
  showDate: true,
  showWeather: true,
  theme: 'dark',
  size: 'medium',
  opacity: '1.0',
  alwaysOnTop: false,
  clickThrough: false,
  startWithWindows: true
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<ClockSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 26,
    conditionText: 'Cloudy',
    conditionCode: 'cloudy'
  });

  const clock = useClock(settings.use24Hour, settings.showSeconds);
  const isDraggingRef = useRef(false);

  const loadWeather = useCallback(async (force = false) => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchWeather(force);
      setWeather(data);
    } catch {
      // Ignore
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Initialize and auto-refresh weather
  useEffect(() => {
    loadWeather(false);

    const handleOnline = () => {
      loadWeather(true);
    };
    window.addEventListener('online', handleOnline);

    // Periodic refresh
    const interval = setInterval(() => {
      loadWeather(false);
    }, 15 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, [loadWeather]);

  // Compute display weather according to unit (°C / °F)
  const displayWeather = React.useMemo(() => {
    if (!weather) return weather;
    if (settings.tempUnit === 'f') {
      return {
        ...weather,
        temperature: Math.round((weather.temperature * 9) / 5 + 32)
      };
    }
    return weather;
  }, [weather, settings.tempUnit]);

  // Theme application
  useEffect(() => {
    let effectiveTheme = settings.theme;
    if (effectiveTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [settings.theme]);

  // Native always on top sync
  useEffect(() => {
    invoke('set_always_on_top', { enabled: settings.alwaysOnTop }).catch(() => {});
  }, [settings.alwaysOnTop]);

  // Native click-through sync
  useEffect(() => {
    invoke('set_click_through', { enabled: settings.clickThrough }).catch(() => {});
    if (settings.clickThrough) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [settings.clickThrough]);

  // Native autostart sync on mount: always ensure registry points to current exe path
  useEffect(() => {
    if (settings.startWithWindows) {
      invoke('set_autostart', { enabled: true }).catch(() => {});
    }
  }, [settings.startWithWindows]);

  // Restore saved window position on launch
  useEffect(() => {
    invoke<[number, number] | null>('get_saved_position')
      .then((pos) => {
        if (pos && Array.isArray(pos) && pos.length === 2) {
          invoke('set_window_position', { x: pos[0], y: pos[1] }).catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Listen to Tray menu events
  useEffect(() => {
    const unlistenShowClock = listen('tray-show-clock', () => {
      setIsSettingsOpen(false);
      invoke('set_click_through', { enabled: false }).catch(() => {});
      if (!settings.alwaysOnTop) {
        setTimeout(() => {
          invoke('set_always_on_top', { enabled: false }).catch(() => {});
        }, 1200);
      }
    });

    const unlistenSettings = listen('tray-open-settings', () => {
      setIsSettingsOpen(true);
      // Temporarily disable clickthrough so user can interact with modal if needed
      invoke('set_click_through', { enabled: false }).catch(() => {});
    });

    const unlistenOntop = listen('tray-toggle-ontop', () => {
      setSettings((prev) => {
        const next = !prev.alwaysOnTop;
        invoke('set_always_on_top', { enabled: next }).catch(() => {});
        return { ...prev, alwaysOnTop: next };
      });
    });

    const unlistenClickthrough = listen('tray-toggle-clickthrough', () => {
      setSettings((prev) => {
        const next = !prev.clickThrough;
        invoke('set_click_through', { enabled: next }).catch(() => {});
        return { ...prev, clickThrough: next };
      });
    });

    return () => {
      unlistenShowClock.then((f) => f());
      unlistenSettings.then((f) => f());
      unlistenOntop.then((f) => f());
      unlistenClickthrough.then((f) => f());
    };
  }, [settings.alwaysOnTop]);

  // Save settings when changed
  const handleUpdateSetting = useCallback(
    <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore
        }

        if (key === 'startWithWindows') {
          invoke('set_autostart', { enabled: Boolean(value) }).catch(() => {});
        }

        return updated;
      });
    },
    []
  );

  // Position saving after drag
  const saveCurrentPosition = useCallback(async () => {
    try {
      const pos = await invoke<[number, number]>('get_window_position');
      if (pos && Array.isArray(pos)) {
        await invoke('save_position', { x: pos[0], y: pos[1] });
      }
    } catch {
      // Ignore
    }
  }, []);

  // Smooth native window dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking on an interactive control, do not trigger window drag
    if (
      (e.target as HTMLElement).closest(
        'button, input, label, a, .toggle-switch, .segmented-control, .variant-card, .close-btn'
      )
    ) {
      return;
    }

    if (e.button === 0) {
      isDraggingRef.current = true;
      invoke('start_dragging_window')
        .then(() => {
          saveCurrentPosition();
        })
        .catch(() => {});
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      saveCurrentPosition();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  const handleDoubleClick = () => {
    setIsSettingsOpen(true);
  };

  const handleResetPosition = () => {
    invoke('center_window').catch(() => {});
  };

  // Render variant with full weather & date support
  const renderVariant = () => {
    const safeWeather: WeatherData = displayWeather || {
      temperature: 26,
      conditionText: 'Cloudy',
      conditionCode: 'cloudy'
    };

    const props = {
      clock,
      weather: safeWeather,
      showSeconds: settings.showSeconds,
      showWeather: settings.showWeather,
      showDate: settings.showDate
    };

    switch (settings.variant) {
      case 'horizontal':
        return <VariantHorizontal {...props} />;
      case 'vertical':
        return <VariantVertical {...props} />;
      case 'day-clock':
        return <VariantDayClock {...props} />;
      case 'weather-side':
        return <VariantClockWeatherSide {...props} />;
      case 'compact':
        return <VariantCompact {...props} />;
      case 'large-info':
        return <VariantLargeInfo {...props} />;
      case 'vertical-weather':
        return <VariantVerticalWeather {...props} />;
      default:
        return <VariantClockWeatherSide {...props} />;
    }
  };

  return (
    <div
      className={`app-container size-${settings.size}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      style={{ opacity: Number(settings.opacity) || 1 }}
    >
      {/* Hide clock when settings is open so it does not bleed through or ghost behind the modal */}
      <div
        style={{
          visibility: isSettingsOpen ? 'hidden' : 'visible',
          opacity: isSettingsOpen ? 0 : 1,
          transition: 'opacity 0.15s ease'
        }}
      >
        {renderVariant()}
      </div>

      {showToast && (
        <div className="clickthrough-toast">
          <span>Click-through enabled. Use System Tray icon to configure or disable.</span>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          if (settings.clickThrough) {
            invoke('set_click_through', { enabled: true }).catch(() => {});
          }
        }}
        settings={settings}
        weather={displayWeather}
        isWeatherLoading={isWeatherLoading}
        onRefreshWeather={() => loadWeather(true)}
        onUpdateSetting={handleUpdateSetting}
        onResetPosition={handleResetPosition}
        onStartDrag={handlePointerDown}
      />
    </div>
  );
};

export default App;
