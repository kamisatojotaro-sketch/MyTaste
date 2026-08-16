import React from 'react';
import { Layers, Shuffle, Sparkles } from 'lucide-react';

export default function CrossPlatformSection({ stats }) {
  if (!stats) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-secondary)] uppercase tracking-wider font-semibold">
            Section 08 // Multi-Platform Synergy
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Cross-Platform Migration
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Unified Timeline Integration</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Your streams across Spotify, YouTube Music, and Apple Music have been synchronized into a single chronological timeline.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold text-emerald-400 block">Spotify</span>
              <p className="text-sm font-mono font-bold text-white">{stats.platformSplit.spotify.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <span className="text-xs font-bold text-red-400 block">YT Music</span>
              <p className="text-sm font-mono font-bold text-white">{stats.platformSplit.youtube_music.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-xs font-bold text-rose-400 block">YouTube</span>
              <p className="text-sm font-mono font-bold text-white">{stats.platformSplit.youtube.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
              <span className="text-xs font-bold text-pink-400 block">Apple Music</span>
              <p className="text-sm font-mono font-bold text-white">{stats.platformSplit.apple_music.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Catalog Exclusives</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            YouTube captures exclusive live sessions, unreleased bootlegs, and video audio that audio-only platforms miss.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-white font-medium">Dedication to Underground Content</span>
            <span className="badge-neon">High Discovery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
