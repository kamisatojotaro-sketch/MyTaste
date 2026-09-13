import React, { useState } from 'react';
import { Music, Flame, ChevronDown, ChevronUp } from 'lucide-react';

export default function SongsSection({ stats }) {
  if (!stats) return null;

  const [showAll, setShowAll] = useState(false);
  const [activDecade, setActiveDecade] = useState('all');

  const DECADE_PILLS = [
    { label: 'All', value: 'all' },
    { label: '2020s', value: '2020s' },
    { label: '2010s', value: '2010s' },
    { label: '2000s', value: '2000s' },
    { label: '1990s', value: '1990s' },
    { label: 'Pre-1990', value: 'Pre-1990' },
  ];

  const rawTracks = stats.topTracksByPlays || stats.topTracks || [];

  const filteredTracks = rawTracks.filter((item) => {
    if (activDecade === 'all') return true;
    if (activDecade === 'Pre-1990') {
      if (item.decade === 'Pre-1990') return true;
      const year = item.year || (item.decade ? parseInt(item.decade, 10) : null);
      return Boolean(year && year < 1990);
    }
    return item.decade === activDecade;
  });

  const displayedTracks = showAll ? filteredTracks : filteredTracks.slice(0, 10);

  // 24-Hour Obsession Peak data
  const obsession = stats.obsessionPeak || stats.funStats?.obsessedSong;
  const peakCount = obsession?.count ?? obsession?.plays ?? obsession?.playCount ?? 0;
  const rawTrack = obsession?.trackName || obsession?.track || obsession?.title || 'Unknown Track';
  const [trackTitle, trackArtist] = rawTrack.includes(' — ')
    ? rawTrack.split(' — ')
    : [rawTrack, obsession?.artist || ''];
  const peakDate = obsession?.date
    ? new Date(obsession.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <section className="space-y-6">
      {/* Section Header & Decade Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Section 03 // Songs</span>
          <h2 className="section-title">Track Obsessions & Deep Cuts</h2>
        </div>

        {/* Decade filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
          {DECADE_PILLS.map((pill) => {
            const isActive = activDecade === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setActiveDecade(pill.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-bold'
                    : 'text-[var(--text-secondary)] hover:text-white border border-transparent hover:bg-white/5'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Ranked Track List (col-span-12 lg:col-span-8) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="font-display font-bold text-lg text-white">
                {activDecade === 'all' ? 'All-Time Top Tracks' : `${activDecade} Standouts`}
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Showing {displayedTracks.length} of {filteredTracks.length} tracks
            </span>
          </div>

          <div className="space-y-2">
            {displayedTracks.length > 0 ? (
              displayedTracks.map((track, idx) => {
                let rankClass = '';
                if (idx === 0) rankClass = 'rank-1';
                else if (idx === 1) rankClass = 'rank-2';
                else if (idx === 2) rankClass = 'rank-3';

                const hours = track.hours !== undefined
                  ? track.hours
                  : (track.ms ? (track.ms / (1000 * 60 * 60)).toFixed(1) : ((track.plays * 3.5) / 60).toFixed(1));

                return (
                  <div
                    key={track.id || `${track.title}-${track.artist}-${idx}`}
                    className="rank-row"
                  >
                    <span className={`rank-number ${rankClass}`}>{idx + 1}</span>
                    <div className="p-2 rounded-lg bg-white/5 text-[var(--accent-cyan)] shrink-0">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate">{track.title}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{track.artist}</p>
                    </div>
                    <div className="text-right shrink-0 font-mono text-sm">
                      <span className="text-white font-semibold block">
                        {track.plays?.toLocaleString() || 0} plays
                      </span>
                      <span className="text-xs text-[var(--text-muted)] block">
                        {hours} hrs
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm font-mono text-[var(--text-muted)]">
                No tracks found for {activDecade}.
              </div>
            )}
          </div>

          {/* Toggle button at bottom: 'View All Tracks' / 'Show Less' */}
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="btn-secondary w-full mt-4 flex items-center justify-center gap-2 text-xs font-mono py-2.5"
          >
            <span>{showAll ? 'Show Less' : 'View All Tracks'}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 24-Hour Obsession Card (col-span-12 lg:col-span-4) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="badge-neon !bg-amber-500/15 !text-amber-400 !border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Obsession Peak
              </span>
              {peakDate && (
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {peakDate}
                </span>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="font-stat text-4xl text-amber-400 leading-none block">
                    {peakCount}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70">
                    Plays in 24h
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-bold text-lg text-white truncate" title={trackTitle}>
                  {trackTitle}
                </h4>
                {trackArtist && (
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {trackArtist}
                  </p>
                )}
              </div>

              <p className="text-xs text-[var(--text-muted)] pt-2 border-t border-amber-500/20">
                Most plays of a single track in 24 hours
              </p>
            </div>
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
