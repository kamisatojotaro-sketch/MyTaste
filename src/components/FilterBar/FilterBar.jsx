import React from 'react';
import { useData } from '../../context/DataContext.jsx';
import { Filter, Calendar, SlidersHorizontal, Check } from 'lucide-react';

export default function FilterBar() {
  const { filters, setFilters, activeSources } = useData();

  const togglePlatform = (platform) => {
    setFilters(prev => {
      const current = prev.platforms || [];
      const exists = current.includes(platform);
      let next;
      if (exists) {
        // Prevent disabling all
        if (current.length === 1) return prev;
        next = current.filter(p => p !== platform);
      } else {
        next = [...current, platform];
      }
      return { ...prev, platforms: next };
    });
  };

  const setTimePreset = (days) => {
    if (!days) {
      setFilters(prev => ({ ...prev, startDate: null, endDate: null }));
      return;
    }
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    setFilters(prev => ({ ...prev, startDate: start.toISOString(), endDate: end.toISOString() }));
  };

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Platform Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Sources:</span>
          </span>

          <button
            onClick={() => togglePlatform('spotify')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.platforms?.includes('spotify')
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold shadow-sm'
                : 'bg-white/5 border-white/10 text-[var(--text-muted)] opacity-60'
            }`}
          >
            <span>🟢 Spotify</span>
            {filters.platforms?.includes('spotify') && <Check className="w-3 h-3" />}
          </button>

          <button
            onClick={() => togglePlatform('youtube_music')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.platforms?.includes('youtube_music')
                ? 'bg-red-500/15 border-red-500/40 text-red-400 font-bold shadow-sm'
                : 'bg-white/5 border-white/10 text-[var(--text-muted)] opacity-60'
            }`}
          >
            <span>🔴 YT Music</span>
            {filters.platforms?.includes('youtube_music') && <Check className="w-3 h-3" />}
          </button>

          <button
            onClick={() => togglePlatform('youtube')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.platforms?.includes('youtube')
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 font-bold shadow-sm'
                : 'bg-white/5 border-white/10 text-[var(--text-muted)] opacity-60'
            }`}
          >
            <span>▶️ YouTube</span>
            {filters.platforms?.includes('youtube') && <Check className="w-3 h-3" />}
          </button>

          <button
            onClick={() => togglePlatform('apple_music')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.platforms?.includes('apple_music')
                ? 'bg-pink-500/15 border-pink-500/40 text-pink-400 font-bold shadow-sm'
                : 'bg-white/5 border-white/10 text-[var(--text-muted)] opacity-60'
            }`}
          >
            <span>🎵 Apple Music</span>
            {filters.platforms?.includes('apple_music') && <Check className="w-3 h-3" />}
          </button>
        </div>

        {/* Date Time Range Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
            <span>Range:</span>
          </span>

          <button
            onClick={() => setTimePreset(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              !filters.startDate ? 'bg-white/15 text-white font-bold' : 'text-[var(--text-secondary)] hover:bg-white/5'
            }`}
          >
            All-Time
          </button>

          <button
            onClick={() => setTimePreset(30)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filters.startDate ? 'bg-white/15 text-white font-bold' : 'text-[var(--text-secondary)] hover:bg-white/5'
            }`}
          >
            Last 30d
          </button>

          <button
            onClick={() => setTimePreset(90)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-white/5 transition-all"
          >
            Last 90d
          </button>

          <button
            onClick={() => setTimePreset(365)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-white/5 transition-all"
          >
            1 Year
          </button>
        </div>
      </div>
    </div>
  );
}
