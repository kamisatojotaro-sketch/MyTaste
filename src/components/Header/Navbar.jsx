import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { getDeviceInfo } from '../../utils/device-detect.js';
import { 
  Music, 
  Sparkles, 
  Moon, 
  Sun, 
  Share2, 
  UploadCloud, 
  RotateCcw, 
  Laptop, 
  Smartphone, 
  Tablet, 
  HelpCircle,
  Film
} from 'lucide-react';

export default function Navbar({ onOpenUpload, onOpenExport, onOpenSettings, onOpenTutorial }) {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode, events, viewMode, setViewMode, clearData } = useData();
  const device = getDeviceInfo();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode(events.length > 0 ? 'dashboard' : 'landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
            <Music className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">MyTaste</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-[var(--accent-primary)] border border-white/10">
                2026
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-medium hidden sm:block">Unified Music Intelligence</p>
          </div>
        </div>

        {/* Center / Status */}
        {events.length > 0 && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[var(--text-secondary)] font-mono">
              {isDemoMode ? "Live Demo Mode" : `${events.length.toLocaleString()} streams loaded`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {events.length > 0 && (
            <>
              <button
                onClick={() => setViewMode('story')}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-[var(--accent-primary)] border-[var(--border-highlight)]"
                title="Watch Wrapped Story"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Story Mode</span>
              </button>

              <button
                onClick={onOpenExport}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                title="Export Shareable 9:16 Card"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Card</span>
              </button>
            </>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            title={`Switch to ${theme === 'electric-cyber' ? 'Obsidian Glass' : 'Electric Cyber'} Theme`}
          >
            {theme === 'electric-cyber' ? <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" /> : <Moon className="w-4 h-4 text-[var(--accent-cyan)]" />}
          </button>

          {/* Tutorial / Help */}
          <button
            onClick={onOpenTutorial}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors hidden sm:flex"
            title="How to Use & Guide"
          >
            <HelpCircle className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>

          {/* Device Indicator */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--text-muted)] font-mono cursor-pointer"
            onClick={onOpenSettings}
            title={`${device.deviceType} • ${device.os} • ${device.browser}`}
          >
            {device.isMobile ? <Smartphone className="w-3.5 h-3.5" /> : (device.isTablet ? <Tablet className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />)}
            <span>{device.deviceType}</span>
          </div>

          {/* Upload / Switch Data */}
          <button
            onClick={onOpenUpload}
            className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{events.length > 0 ? "Upload More" : "Upload Data"}</span>
          </button>

          {events.length > 0 && (
            <button
              onClick={clearData}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Reset Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
