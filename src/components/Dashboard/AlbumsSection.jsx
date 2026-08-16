import React from 'react';
import { Disc, Layers, Sparkles } from 'lucide-react';

export default function AlbumsSection({ stats }) {
  if (!stats) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase tracking-wider font-semibold">
            Section 04 // Full Projects
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Top Albums & LP Deep-Dives
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Top 6 Album Cards */}
        {stats.topAlbums.slice(0, 6).map((album, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4 hover:border-[var(--border-highlight)] transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--accent-secondary)]/30 to-[var(--accent-primary)]/30 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Disc className="w-6 h-6 text-[var(--accent-primary)]" />
              </div>
              <span className="font-mono font-bold text-xs text-[var(--text-muted)]">
                #{idx + 1}
              </span>
            </div>

            <div className="space-y-1 truncate">
              <h4 className="font-display font-bold text-base text-white truncate">
                {album.album}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {album.artist}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--accent-primary)] font-bold">{album.plays} total plays</span>
              <span className="text-[var(--text-muted)]">{(album.ms / (1000 * 60 * 60)).toFixed(1)} hrs</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
