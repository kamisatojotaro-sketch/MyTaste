import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { getDeviceInfo } from '../../utils/device-detect.js';
import { X, Laptop, Smartphone, Tablet, Moon, Sparkles, Trash2, HelpCircle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onOpenTutorial }) {
  const { theme, toggleTheme } = useTheme();
  const { clearData, events } = useData();
  const device = getDeviceInfo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-display font-bold text-2xl text-white">
            Preferences & Device Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Configure appearance and inspect client environment.
          </p>
        </div>

        {/* Device Information Section */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] font-bold uppercase">
            {device.isMobile ? <Smartphone className="w-4 h-4" /> : (device.isTablet ? <Tablet className="w-4 h-4" /> : <Laptop className="w-4 h-4" />)}
            <span>Current Device Environment</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Device Type</span>
              <span className="text-white font-bold">{device.deviceType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Operating System</span>
              <span className="text-white font-bold">{device.os}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Browser</span>
              <span className="text-white font-bold">{device.browser}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Viewport</span>
              <span className="text-white font-mono">{device.screenWidth} × {device.screenHeight}</span>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <h4 className="text-sm font-bold text-white">Visual Palette</h4>
            <p className="text-xs text-[var(--text-secondary)]">Currently: {theme === 'electric-cyber' ? 'Electric Cyber' : 'Obsidian Glass'}</p>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5 font-bold"
          >
            {theme === 'electric-cyber' ? <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" /> : <Moon className="w-4 h-4 text-[var(--accent-cyan)]" />}
            <span>Switch Theme</span>
          </button>
        </div>

        {/* Tutorial & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => { onClose(); onOpenTutorial(); }}
            className="text-xs text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Replay Onboarding Tutorial</span>
          </button>

          {events.length > 0 && (
            <button
              onClick={() => { clearData(); onClose(); }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Current Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
