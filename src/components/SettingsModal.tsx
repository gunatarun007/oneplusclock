import React from 'react';
import { X, RotateCcw, Heart, ExternalLink } from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { OnePlusLogo } from './OnePlusLogo';
import { ClockState } from '../hooks/useClock';

export type ClockVariant =
  | 'horizontal'
  | 'vertical'
  | 'day-clock'
  | 'compact';

export type ClockSize = 'small' | 'medium' | 'large' | 'huge';
export type ClockTheme = 'dark' | 'light' | 'auto';
export type ClockOpacity = '1.0' | '0.9' | '0.8' | '0.7';

export interface ClockSettings {
  variant: ClockVariant;
  use24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  theme: ClockTheme;
  size: ClockSize;
  opacity: ClockOpacity;
  alwaysOnTop: boolean;
  clickThrough: boolean;
  startWithWindows: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  clock: ClockState;
  onUpdateSetting: <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => void;
  onResetPosition: () => void;
  onStartDrag?: (e: React.PointerEvent) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  clock,
  onUpdateSetting,
  onResetPosition,
  onStartDrag
}) => {
  if (!isOpen) return null;

  const handleOpenLinkedIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await openUrl('https://www.linkedin.com/in/taruntejaguna');
    } catch {
      window.open('https://www.linkedin.com/in/taruntejaguna', '_blank');
    }
  };

  const variants: { id: ClockVariant; label: string }[] = [
    { id: 'horizontal', label: 'Horizontal' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'day-clock', label: 'Day + Clock' },
    { id: 'compact', label: 'Compact' }
  ];

  const renderMiniPreview = (id: ClockVariant) => {
    switch (id) {
      case 'horizontal':
        return (
          <div className="variant-preview-mini" style={{ gap: 2 }}>
            <div>
              <span className="preview-accent">{clock.firstHourDigit}</span>
              {clock.restHourDigits}:{clock.minutes}
              {settings.showSeconds && (
                <span style={{ fontSize: '0.65em', opacity: 0.85 }}>:{clock.seconds}</span>
              )}
              {!settings.use24Hour && clock.ampm && (
                <span style={{ fontSize: '0.6em', marginLeft: 2 }}>{clock.ampm}</span>
              )}
            </div>
            {settings.showDate && <div className="preview-sub">{clock.dateShort}</div>}
          </div>
        );
      case 'vertical':
        return (
          <div className="variant-preview-mini" style={{ gap: 2 }}>
            {settings.showDate && <div className="preview-sub">{clock.dateShort}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.82, alignItems: 'center' }}>
              <span style={{ letterSpacing: -0.5 }}>
                <span className="preview-accent">{clock.firstHourDigit}</span>
                {clock.restHourDigits}
              </span>
              <span>
                {clock.minutes}
                {settings.showSeconds && (
                  <span style={{ fontSize: '0.6em', opacity: 0.85 }}>:{clock.seconds}</span>
                )}
              </span>
            </div>
            {!settings.use24Hour && clock.ampm && (
              <span style={{ fontSize: '0.55rem', marginTop: 1 }}>{clock.ampm}</span>
            )}
          </div>
        );
      case 'day-clock':
        return (
          <div className="variant-preview-mini" style={{ gap: 1 }}>
            <div className="preview-sub">{clock.dayName}</div>
            <div>
              <span className="preview-accent">{clock.firstHourDigit}</span>
              {clock.restHourDigits}:{clock.minutes}
              {settings.showSeconds && (
                <span style={{ fontSize: '0.65em', opacity: 0.85 }}>:{clock.seconds}</span>
              )}
              {!settings.use24Hour && clock.ampm && (
                <span style={{ fontSize: '0.6em', marginLeft: 2 }}>{clock.ampm}</span>
              )}
            </div>
            {settings.showDate && <div className="preview-sub">{clock.dateWithMonth}</div>}
          </div>
        );
      case 'compact':
        return (
          <div className="variant-preview-mini" style={{ gap: 1 }}>
            {settings.showDate && <div className="preview-sub">{clock.dateShort}</div>}
            <div>
              <span className="preview-accent">{clock.firstHourDigit}</span>
              {clock.restHourDigits}:{clock.minutes}
              {settings.showSeconds && (
                <span style={{ fontSize: '0.65em', opacity: 0.85 }}>:{clock.seconds}</span>
              )}
              {!settings.use24Hour && clock.ampm && (
                <span style={{ fontSize: '0.6em', marginLeft: 2 }}>{clock.ampm}</span>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Draggable anywhere on the header */}
        <div
          className="settings-header"
          onPointerDown={(e) => {
            if (!(e.target as HTMLElement).closest('button')) {
              onStartDrag?.(e);
            }
          }}
          title="Drag anywhere here to move the widget"
        >
          <div className="settings-title">
            <OnePlusLogo size={28} />
            <span>Clock Settings</span>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="settings-body">
          {/* Style Selector */}
          <div className="settings-section">
            <span className="section-label">Clock Style</span>
            <div className="variant-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {variants.map((v) => (
                <button
                  key={v.id}
                  className={`variant-card ${settings.variant === v.id ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('variant', v.id)}
                >
                  {renderMiniPreview(v.id)}
                  <span className="variant-card-title">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time and Format Options */}
          <div className="settings-section">
            <span className="section-label">Time & Display</span>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">24-Hour Format</span>
                <span className="option-desc">Display 24-hour time format instead of 12-hour AM/PM</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.use24Hour}
                  onChange={(e) => onUpdateSetting('use24Hour', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">Show Seconds</span>
                <span className="option-desc">Display active ticking seconds</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showSeconds}
                  onChange={(e) => onUpdateSetting('showSeconds', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">Show Date</span>
                <span className="option-desc">Display current date and day</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showDate}
                  onChange={(e) => onUpdateSetting('showDate', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Appearance Options */}
          <div className="settings-section">
            <span className="section-label">Appearance</span>

            {/* Theme */}
            <div className="option-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <span className="option-title">Theme</span>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('theme', 'dark')}
                >
                  Dark
                </button>
                <button
                  className={`segment-btn ${settings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('theme', 'light')}
                >
                  Light
                </button>
                <button
                  className={`segment-btn ${settings.theme === 'auto' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('theme', 'auto')}
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Size */}
            <div className="option-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <span className="option-title">Clock Size</span>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${settings.size === 'small' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('size', 'small')}
                >
                  Small
                </button>
                <button
                  className={`segment-btn ${settings.size === 'medium' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('size', 'medium')}
                >
                  Medium
                </button>
                <button
                  className={`segment-btn ${settings.size === 'large' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('size', 'large')}
                >
                  Large
                </button>
                <button
                  className={`segment-btn ${settings.size === 'huge' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('size', 'huge')}
                >
                  Huge
                </button>
              </div>
            </div>

            {/* Opacity */}
            <div className="option-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <span className="option-title">Opacity</span>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${settings.opacity === '1.0' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('opacity', '1.0')}
                >
                  100%
                </button>
                <button
                  className={`segment-btn ${settings.opacity === '0.9' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('opacity', '0.9')}
                >
                  90%
                </button>
                <button
                  className={`segment-btn ${settings.opacity === '0.8' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('opacity', '0.8')}
                >
                  80%
                </button>
                <button
                  className={`segment-btn ${settings.opacity === '0.7' ? 'active' : ''}`}
                  onClick={() => onUpdateSetting('opacity', '0.7')}
                >
                  70%
                </button>
              </div>
            </div>
          </div>

          {/* Windows Integration Options */}
          <div className="settings-section">
            <span className="section-label">Windows Desktop Behavior</span>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">Always on Top</span>
                <span className="option-desc">Keep clock above all active windows</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.alwaysOnTop}
                  onChange={(e) => onUpdateSetting('alwaysOnTop', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">Click-Through</span>
                <span className="option-desc">
                  Mouse clicks pass through to desktop (Disable via System Tray)
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.clickThrough}
                  onChange={(e) => onUpdateSetting('clickThrough', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="option-row">
              <div className="option-info">
                <span className="option-title">Start with Windows</span>
                <span className="option-desc">Launch widget automatically on boot</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.startWithWindows}
                  onChange={(e) => onUpdateSetting('startWithWindows', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Reset Position Button */}
          <button
            className="segment-btn"
            onClick={onResetPosition}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              border: '1px solid var(--settings-card-border)',
              background: 'var(--settings-card-bg)',
              color: 'var(--settings-text)'
            }}
          >
            <RotateCcw size={15} />
            Reset Position to Center
          </button>

          {/* Creator Credits & 3rd-Party Disclaimer */}
          <div
            style={{
              marginTop: 6,
              paddingTop: 14,
              borderTop: '1px solid var(--settings-card-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              textAlign: 'center'
            }}
          >
            {/* Creator Profile Link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '0.84rem',
                fontWeight: 500,
                color: 'var(--settings-text)'
              }}
            >
              <span>Built with <Heart size={14} fill="#E92828" stroke="#E92828" style={{ display: 'inline-block', verticalAlign: '-2px' }} /> by</span>
              <button
                onClick={handleOpenLinkedIn}
                title="Open Tarun Teja's LinkedIn Profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(233, 40, 40, 0.12)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(233, 40, 40, 0.4)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(233, 40, 40, 0.25)';
                  e.currentTarget.style.borderColor = '#E92828';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(233, 40, 40, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(233, 40, 40, 0.4)';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.45 1.45 0 0 0-1.49 1.45c0 .8.66 1.45 1.46 1.45.8 0 1.46-.65 1.46-1.45 0-.8-.66-1.45-1.43-1.45Z" />
                </svg>
                <span>taruntejaguna</span>
                <ExternalLink size={11} style={{ opacity: 0.7 }} />
              </button>
            </div>

            {/* Third-Party Fan Project Disclaimer */}
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--settings-subtext)',
                lineHeight: 1.45,
                maxWidth: 360,
                margin: '0 auto'
              }}
            >
              Independent fan-made desktop widget created by a passionate OnePlus lover. Not an official OnePlus product. Recreating the iconic OxygenOS design for the Windows community.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
