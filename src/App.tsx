import React, { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useClock } from './hooks/useClock';
import {
  SettingsModal,
  ClockSettings
} from './components/SettingsModal';

import { VariantHorizontal } from './components/variants/VariantHorizontal';
import { VariantVertical } from './components/variants/VariantVertical';
import { VariantDayClock } from './components/variants/VariantDayClock';
import { VariantCompact } from './components/variants/VariantCompact';

const SETTINGS_STORAGE_KEY = 'oneplus_clock_desktop_settings';

const DEFAULT_SETTINGS: ClockSettings = {
  variant: 'horizontal',
  use24Hour: true,
  showSeconds: false,
  showDate: true,
  theme: 'dark',
  size: 'medium',
  opacity: '1.0',
  alwaysOnTop: false,
  clickThrough: false,
  startWithWindows: false
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

  const clock = useClock(settings.use24Hour, settings.showSeconds);
  const isDraggingRef = useRef(false);

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

  // Native autostart sync on mount
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
    });

    const unlistenSettings = listen('tray-open-settings', () => {
      setIsSettingsOpen(true);
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
  }, []);

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
      if (pos && Array.isArray(pos) && pos.length === 2) {
        await invoke('save_position', { x: pos[0], y: pos[1] });
      }
    } catch {
      // Ignore
    }
  }, []);

  // Smooth native window dragging
  const handlePointerDown = (e: React.PointerEvent) => {
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

  // Render variant
  const renderVariant = () => {
    const props = {
      clock,
      showSeconds: settings.showSeconds,
      showDate: settings.showDate
    };

    switch (settings.variant) {
      case 'horizontal':
        return <VariantHorizontal {...props} />;
      case 'vertical':
        return <VariantVertical {...props} />;
      case 'day-clock':
        return <VariantDayClock {...props} />;
      case 'compact':
        return <VariantCompact {...props} />;
      default:
        return <VariantHorizontal {...props} />;
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
        clock={clock}
        onUpdateSetting={handleUpdateSetting}
        onResetPosition={handleResetPosition}
        onStartDrag={handlePointerDown}
      />
    </div>
  );
};

export default App;
