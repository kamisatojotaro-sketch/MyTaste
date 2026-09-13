import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { getDeviceInfo } from '../../utils/device-detect.js';
import { 
  X, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Moon, 
  Sun, 
  Sparkles, 
  Trash2, 
  HelpCircle,
  Settings,
  Check,
  AlertTriangle,
  Palette,
  ShieldCheck,
  Monitor,
  HardDrive,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onOpenTutorial }) {
  const { theme, setTheme } = useTheme();
  const { clearData, events, isDemoMode } = useData();
  const device = getDeviceInfo();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClear = () => {
    clearData();
    setIsConfirmingClear(false);
    onClose();
  };

  const handleCancelClear = () => {
    setIsConfirmingClear(false);
  };

  const getDeviceIcon = () => {
    if (device.isMobile) return <Smartphone className="w-5 h-5 text-[var(--accent-primary)]" />;
    if (device.isTablet) return <Tablet className="w-5 h-5 text-[var(--accent-cyan)]" />;
    return <Laptop className="w-5 h-5 text-[var(--accent-primary)]" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Modal Container */}
      <div className="glass-panel w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col relative border-white/15 shadow-2xl animate-scaleUp overflow-hidden">
        
        {/* Top Header - Fixed */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge-neon">
                <Settings className="w-3.5 h-3.5" />
                <span>Preferences & Diagnostics</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline-block">
                Obsidian Aurora Engine
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              System Settings
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Visual palette customization, live client telemetry, and session management.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 space-y-6 overscroll-contain pr-3 sm:pr-6">
          
          {/* 1. VISUAL THEME WITH PREVIEW CHIPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
                <h4 className="font-display font-bold text-sm text-white">Visual Palette</h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Active: {theme === 'electric-cyber' ? 'Electric Cyber' : 'Obsidian Glass'}
              </span>
            </div>

            {/* Theme Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Theme Chip 1: Electric Cyber */}
              <div
                onClick={() => setTheme('electric-cyber')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setTheme('electric-cyber')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  theme === 'electric-cyber'
                    ? 'bg-[#00FFA3]/10 border-[#00FFA3] shadow-[0_0_25px_rgba(0,255,163,0.2)] ring-1 ring-[#00FFA3]/40'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00FFA3]" />
                      <span className="font-display font-bold text-sm text-white">Electric Cyber</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                      Emerald // Cyber Cyan
                    </span>
                  </div>

                  {theme === 'electric-cyber' ? (
                    <span className="badge-neon !py-0.5 !px-2 text-[10px] !bg-[#00FFA3]/20 !text-[#00FFA3] !border-[#00FFA3]/40">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-white/5">
                      Select
                    </span>
                  )}
                </div>

                {/* Color Swatches & Mini Mockup Preview */}
                <div className="p-2.5 rounded-xl bg-[#050508]/80 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Palette Swatches</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]" title="Accent Primary (#00FFA3)" />
                      <span className="w-3 h-3 rounded-full bg-[#00F5D4]" title="Accent Cyan (#00F5D4)" />
                      <span className="w-3 h-3 rounded-full bg-[#8A2BE2]" title="Accent Violet (#8A2BE2)" />
                      <span className="w-3 h-3 rounded-full bg-[#151926] border border-white/20" title="Surface Base (#151926)" />
                    </div>
                  </div>

                  {/* Micro UI Mockup */}
                  <div className="h-9 rounded-lg bg-[#0E111A] border border-[#00FFA3]/30 px-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                      <span className="text-[10px] font-mono text-white/90 font-bold">2,500+ STREAMS</span>
                    </div>
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 h-3 rounded-full bg-[#00FFA3]" />
                      <span className="w-1 h-2 rounded-full bg-[#00F5D4]" />
                      <span className="w-1 h-2.5 rounded-full bg-[#8A2BE2]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Chip 2: Obsidian Glass */}
              <div
                onClick={() => setTheme('obsidian-glass')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setTheme('obsidian-glass')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  theme === 'obsidian-glass'
                    ? 'bg-[#00F5D4]/10 border-[#00F5D4] shadow-[0_0_25px_rgba(0,245,212,0.2)] ring-1 ring-[#00F5D4]/40'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span className="font-display font-bold text-sm text-white">Obsidian Glass</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                      Cyan // Royal Purple
                    </span>
                  </div>

                  {theme === 'obsidian-glass' ? (
                    <span className="badge-purple !py-0.5 !px-2 text-[10px] !bg-[#00F5D4]/20 !text-[#00F5D4] !border-[#00F5D4]/40">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-white/5">
                      Select
                    </span>
                  )}
                </div>

                {/* Color Swatches & Mini Mockup Preview */}
                <div className="p-2.5 rounded-xl bg-[#06070A]/80 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Palette Swatches</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#00F5D4] shadow-[0_0_8px_#00F5D4]" title="Accent Primary (#00F5D4)" />
                      <span className="w-3 h-3 rounded-full bg-[#7928CA]" title="Accent Purple (#7928CA)" />
                      <span className="w-3 h-3 rounded-full bg-[#F72585]" title="Accent Magenta (#F72585)" />
                      <span className="w-3 h-3 rounded-full bg-[#121825] border border-white/20" title="Surface Base (#121825)" />
                    </div>
                  </div>

                  {/* Micro UI Mockup */}
                  <div className="h-9 rounded-lg bg-[#0C1018] border border-[#00F5D4]/30 px-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                      <span className="text-[10px] font-mono text-white/90 font-bold">2,500+ STREAMS</span>
                    </div>
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 h-3 rounded-full bg-[#00F5D4]" />
                      <span className="w-1 h-2 rounded-full bg-[#7928CA]" />
                      <span className="w-1 h-2.5 rounded-full bg-[#F72585]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. DEVICE TELEMETRY & CLIENT METRICS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--accent-cyan)]" />
                <h4 className="font-display font-bold text-sm text-white">Device Telemetry & Environment</h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--accent-primary)] font-bold">
                100% In-Browser RAM
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
                  {getDeviceIcon()}
                  <span className="text-white font-semibold">{device.deviceType} Environment</span>
                </div>
                <span className="badge-neon !py-0.5 !px-2 text-[10px]">
                  {device.isTouch ? "Touch Ready" : "Pointer Native"}
                </span>
              </div>

              {/* Telemetry 6-Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Form Factor</span>
                  <div className="flex items-center gap-1.5">
                    {device.isMobile ? <Smartphone className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> : (device.isTablet ? <Tablet className="w-3.5 h-3.5 text-[var(--accent-cyan)]" /> : <Monitor className="w-3.5 h-3.5 text-[var(--accent-primary)]" />)}
                    <span className="text-white font-bold">{device.deviceType}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Operating System</span>
                  <span className="text-white font-bold truncate block">{device.os}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Browser Engine</span>
                  <span className="text-white font-bold truncate block">{device.browser}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Viewport Size</span>
                  <span className="text-white font-mono font-bold block">{device.screenWidth} × {device.screenHeight}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Touch Capability</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${device.isTouch ? 'bg-emerald-400' : 'bg-white/40'}`} />
                    <span className="text-white font-semibold">{device.isTouch ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Storage Architecture</span>
                  <div className="flex items-center gap-1 text-[var(--accent-cyan)]">
                    <HardDrive className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold truncate">Local Cache</span>
                  </div>
                </div>

              </div>

              {/* Active Session Status */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] border-t border-white/5 font-mono">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Loaded Streams: <strong className="text-white">{events.length.toLocaleString()}</strong> events</span>
                </div>
                <span className="text-[var(--text-muted)]">
                  Mode: <strong className="text-[var(--accent-cyan)]">{isDemoMode ? 'Live Sample Profile' : 'Custom User Archive'}</strong>
                </span>
              </div>

            </div>
          </div>

          {/* 3. SESSION DATA MANAGEMENT & CONFIRMATION DIALOG */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-red-400" />
                <h4 className="font-display font-bold text-sm text-white">Data Management & Cache</h4>
              </div>
            </div>

            {/* Clear Confirmation Card vs Normal State */}
            {!isConfirmingClear ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">Client Storage Session</span>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {events.length > 0 
                      ? `${events.length.toLocaleString()} listening records stored in browser cache.`
                      : 'No listening events currently cached.'
                    }
                  </p>
                </div>

                {events.length > 0 && (
                  <button
                    onClick={() => setIsConfirmingClear(true)}
                    className="btn-secondary !py-2 !px-3.5 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/60 transition-colors flex items-center gap-1.5 font-semibold shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Current Data</span>
                  </button>
                )}
              </div>
            ) : (
              /* Inline Confirmation Dialog */
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-sm text-white">
                      Confirm Session Reset & Data Wipe?
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Are you sure you want to clear your current session with <strong className="text-red-400">{events.length.toLocaleString()} streams</strong>? This will wipe your browser's local cache and reload the default session.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handleCancelClear}
                    className="btn-secondary !py-2 !px-4 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClear}
                    className="btn-primary !bg-red-500 !text-white !py-2 !px-4 text-xs font-bold hover:!bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Wipe Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. ONBOARDING TUTORIAL SHORTCUT */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <HelpCircle className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Need a refresher on dashboard controls?</span>
            </div>

            <button
              onClick={() => { onClose(); onOpenTutorial(); }}
              className="text-xs text-[var(--accent-cyan)] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Replay Onboarding</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Fixed Footer Guarantee */}
        <div className="shrink-0 px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero telemetry uploaded. Data stays strictly inside your browser.</span>
          </div>
          <span className="font-mono text-[10px]">MyTaste 2024</span>
        </div>

      </div>
    </div>
  );
}
