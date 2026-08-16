import React, { useState } from 'react';
import { Music, Flame, Disc, Sparkles } from 'lucide-react';

export default function SongsSection({ stats }) {
  const [selectedDecade, setSelectedDecade] = useState('all');

  if (!stats) return null;

  const filteredTracks = selectedDecade === 'all' 
    ? stats.topTracks.slice(0, 10) 
    : stats.topTracks.filter(t => t.decade === selectedDecade).slice(0, 10);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-semibold">
            Section 03 // Track Dynamics
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Top Songs & Heavy Repeats
          </h2>
        </div>

        {/* Decade Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setSelectedDecade('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedDecade === 'all' ? 'bg-[var(--accent-primary)] text-black' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            All Decades
          </button>
          {stats.decades.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDecade(d.decade)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedDecade === d.decade ? 'bg-[var(--accent-primary)] text-black' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {d.decade}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Top 10 Ranked Tracks List */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-lg text-white">
              {selectedDecade === 'all' ? 'All-Time Top Tracks' : `Top Tracks from the ${selectedDecade}`}
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Plays & Duration</span>
          </div>

          <div className="space-y-2">
            {filteredTracks.map((track, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <span className="font-mono font-bold text-[var(--accent-primary)] text-sm w-5">
                    #{idx + 1}
                  </span>
                  <div className="p-2 rounded-lg bg-white/5 text-[var(--accent-cyan)] shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-white truncate">{track.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{track.artist} {track.album ? `• ${track.album}` : ''}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="font-bold text-sm text-[var(--accent-primary)] block">
                    {track.plays} plays
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {(track.ms / (1000 * 60)).toFixed(0)} mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24-hr Obsession Index Highlight */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="badge-neon !bg-amber-500/15 !text-amber-400 !border-amber-500/30">
              🔥 24-Hour Obsession Index
            </span>
            {stats.funStats.obsessedSong ? (
              <div className="space-y-2">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
                  <Flame className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="font-display font-black text-xl text-white">
                    {stats.funStats.obsessedSong.track.split(' — ')[0]}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {stats.funStats.obsessedSong.track.split(' — ')[1]}
                  </p>
                  <div className="pt-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {stats.funStats.obsessedSong.count} plays
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      in a single 24-hour frenzy on {new Date(stats.funStats.obsessedSong.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Steady repeat habits with no single-day frenzies.</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs text-[var(--text-secondary)]">
            <span className="font-bold text-white block">Burnout Rate Protection</span>
            <p>Your library shows steady rotational variety, keeping track burnout low.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
