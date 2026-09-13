import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import EqualizerBars from '../../components/Effects/EqualizerBars.jsx';
import {
  Music,
  Sparkles,
  Moon,
  Share2,
  Zap,
  RotateCcw,
  HelpCircle,
  Film,
  Settings
} from 'lucide-react';

export default function Navbar({ onOpenConnect, onOpenExport, onOpenSettings, onOpenTutorial }) {
  const { theme, toggleTheme } = useTheme();
  const { events, viewMode, setViewMode, clearData } = useData();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setViewMode('dashboard')}
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
            <Music className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">MyTaste</span>
              <span className="badge-neon !text-[10px] !py-0.5 !px-2">
                Live
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-medium hidden sm:block">Direct Music Intelligence</p>
          </div>
        </div>

        {/* Center: Equalizer + stream counter */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <EqualizerBars color="var(--accent-primary)" />
          <span className="text-[var(--text-secondary)] font-mono">
            {(events?.length || 0).toLocaleString()} streams
          </span>
        </div>

        {/* Actions (right side) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Story Mode */}
          <button
            onClick={() => setViewMode('story')}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-[var(--accent-primary)] border-[var(--border-highlight)]"
            title="Watch Wrapped Story"
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Story Mode</span>
          </button>

          {/* 2. Share Card */}
          <button
            onClick={onOpenExport}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Export Share Card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Card</span>
          </button>

          {/* 3. Connect Accounts */}
          <button
            onClick={onOpenConnect}
            className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold"
            title="Connect Accounts"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Connect Accounts</span>
          </button>

          {/* 4. Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'electric-cyber' ? (
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent-cyan)]" />
            )}
          </button>

          {/* 5. Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* 6. Help / Tutorial */}
          <button
            onClick={onOpenTutorial}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center justify-center"
            title="Guide & Help"
            aria-label="Guide & Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* 7. Reset */}
          <button
            onClick={clearData}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Data"
            aria-label="Reset Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
