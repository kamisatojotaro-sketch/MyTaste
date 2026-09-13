import React, { useState, useMemo } from 'react';
import { Disc3, Play, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function AlbumsSection({ stats }) {
  const [showAll, setShowAll] = useState(false);

  if (!stats) return null;

  const albums = stats.topAlbums || [];
  const displayAlbums = showAll ? albums : albums.slice(0, 6);
  const maxPlays = albums[0]?.plays || 1;

  // Compute album summary insights
  const { totalUniqueAlbums, avgPlaysPerAlbum, mostCompleteArtist, mostCompleteCount } = useMemo(() => {
    const totalUnique = stats.uniqueAlbums || albums.length;

    // Calculate average plays per album across library
    const totalStreamsCount = stats.totalStreams || albums.reduce((acc, curr) => acc + (curr.plays || 0), 0);
    const avgPlays = totalUnique > 0
      ? (totalStreamsCount / totalUnique).toFixed(1)
      : (albums.length > 0 ? (totalStreamsCount / albums.length).toFixed(1) : '0.0');

    // Find artist appearing in the most unique albums
    const artistAlbumMap = {};

    // Analyze from topAlbums
    albums.forEach(item => {
      if (item.artist && item.album) {
        if (!artistAlbumMap[item.artist]) {
          artistAlbumMap[item.artist] = new Set();
        }
        artistAlbumMap[item.artist].add(item.album);
      }
    });

    // Cross-reference with topTracks for richer catalog depth
    if (stats.topTracks && Array.isArray(stats.topTracks)) {
      stats.topTracks.forEach(track => {
        if (track.artist && track.album) {
          if (!artistAlbumMap[track.artist]) {
            artistAlbumMap[track.artist] = new Set();
          }
          artistAlbumMap[track.artist].add(track.album);
        }
      });
    }

    let champArtist = 'N/A';
    let maxAlbumsFound = 0;

    Object.entries(artistAlbumMap).forEach(([artist, albumSet]) => {
      if (albumSet.size > maxAlbumsFound) {
        maxAlbumsFound = albumSet.size;
        champArtist = artist;
      }
    });

    if (maxAlbumsFound === 0 && stats.topArtistsByPlays?.[0]) {
      champArtist = stats.topArtistsByPlays[0].name;
      maxAlbumsFound = 1;
    }

    return {
      totalUniqueAlbums: totalUnique,
      avgPlaysPerAlbum: avgPlays,
      mostCompleteArtist: champArtist,
      mostCompleteCount: maxAlbumsFound
    };
  }, [stats, albums]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Section 04 // Albums</span>
          <h2 className="section-title mt-1">LP Deep-Dives & Full Albums</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-neon">
            <Disc3 className="w-3.5 h-3.5" />
            {albums.length} Ranked Albums
          </span>
        </div>
      </div>

      {/* Album Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayAlbums.map((album, idx) => {
          const playRatio = Math.min(100, Math.max(4, Math.round((album.plays / maxPlays) * 100)));
          const hours = (album.ms / (1000 * 60 * 60)).toFixed(1);
          const rankColorClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'text-[var(--text-muted)]';

          return (
            <div
              key={`${album.album}-${album.artist}-${idx}`}
              className="glass-panel glass-panel-interactive p-5 relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Subtle background micro-bar indicator */}
              <div
                className="micro-bar bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]"
                style={{ width: `${playRatio}%` }}
              />

              <div className="space-y-4 relative z-10">
                {/* Top Section: Disc placeholder & Rank */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] flex items-center justify-center shrink-0 shadow-lg shadow-black/40 group-hover:rotate-12 transition-transform duration-500">
                    <Disc3 className="w-8 h-8 text-[#050508]" />
                  </div>

                  <span className={`rank-number ${rankColorClass}`}>
                    #{idx + 1}
                  </span>
                </div>

                {/* Album Title & Artist */}
                <div className="space-y-1">
                  <h4
                    className="font-display font-bold text-lg text-white truncate group-hover:text-[var(--accent-primary)] transition-colors"
                    title={album.album}
                  >
                    {album.album}
                  </h4>
                  <p
                    className="text-sm text-[var(--text-secondary)] truncate"
                    title={album.artist}
                  >
                    {album.artist}
                  </p>
                </div>
              </div>

              {/* Stats Row & Bottom Micro-bar */}
              <div className="pt-4 mt-3 border-t border-white/10 space-y-2 relative z-10">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-1.5 text-[var(--accent-primary)] font-bold">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {album.plays.toLocaleString()} plays
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Clock className="w-3.5 h-3.5" />
                    {hours} hrs
                  </span>
                </div>

                {/* Subtle micro-bar at the bottom showing relative play proportion vs #1 album */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full transition-all duration-500"
                    style={{ width: `${playRatio}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle button */}
      {albums.length > 6 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="btn-secondary group flex items-center gap-2 text-sm font-semibold"
          >
            <span>{showAll ? 'Show Top 6' : `View All ${albums.length} Albums`}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4 text-[var(--accent-primary)] transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--accent-primary)] transition-transform group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Album Stats Summary Card (below grid, col-span-12) */}
      <div className="glass-panel p-5 col-span-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Total Unique Albums */}
          <div className="flex flex-col justify-between space-y-2 md:pr-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Catalog Depth
              </span>
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-primary)]">
                <Disc3 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Total Unique Albums</p>
              <h4 className="font-display font-black text-3xl sm:text-4xl text-white font-mono mt-0.5">
                {totalUniqueAlbums.toLocaleString()}
              </h4>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Unique album releases listened across library
            </p>
          </div>

          {/* Average Plays per Album */}
          <div className="flex flex-col justify-between space-y-2 pt-4 md:pt-0 md:px-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Listening Density
              </span>
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-cyan)]">
                <Play className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Average Plays per Album</p>
              <h4 className="font-display font-black text-3xl sm:text-4xl text-[var(--accent-cyan)] font-mono mt-0.5">
                {avgPlaysPerAlbum}
              </h4>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Mean streams logged per album project
            </p>
          </div>

          {/* Most Album-Complete Artist */}
          <div className="flex flex-col justify-between space-y-2 pt-4 md:pt-0 md:pl-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Discography Champion
              </span>
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-secondary)]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Most Album-Complete Artist</p>
              <h4
                className="font-display font-black text-2xl sm:text-3xl text-white truncate mt-0.5"
                title={mostCompleteArtist}
              >
                {mostCompleteArtist}
              </h4>
            </div>
            <p className="text-[11px] font-mono text-[var(--accent-secondary)]">
              {mostCompleteCount} {mostCompleteCount === 1 ? 'unique album' : 'unique albums'} in rotation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
