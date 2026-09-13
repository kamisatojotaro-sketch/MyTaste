import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Crown, ChevronDown, ChevronUp, BarChart3, Clock, Play } from 'lucide-react';

export default function ArtistsSection({ stats }) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('plays');

  if (!stats) return null;

  const currentArtists = (sortBy === 'plays' ? stats.topArtistsByPlays : stats.topArtistsByDuration) || [];
  const top10 = currentArtists.slice(0, 10);
  const fullArtistList = currentArtists.slice(0, 50);

  // #1 Artist for Superfan Spotlight
  const topArtist = stats.topArtistsByPlays?.[0] || null;
  const topArtistPlays = topArtist?.plays || 0;
  const topArtistHours = topArtist ? (topArtist.ms / (1000 * 60 * 60)).toFixed(1) : '0.0';

  // Horizontal Bar Chart configuration
  const barChartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#11141F',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        textStyle: { color: '#F8FAFC', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        formatter: (params) => {
          if (!params || !params[0]) return '';
          const idx = params[0].dataIndex;
          const artist = top10[idx];
          if (!artist) return '';
          const hrs = (artist.ms / (1000 * 60 * 60)).toFixed(1);
          return `<div style="font-weight:700;margin-bottom:4px;color:#FFF;">${artist.name}</div>
                  <div style="color:#00FFA3;font-family:JetBrains Mono;font-size:12px;">${artist.plays.toLocaleString()} plays</div>
                  <div style="color:#94A3B8;font-family:JetBrains Mono;font-size:11px;">${hrs} hours streamed</div>`;
        }
      },
      grid: {
        left: '2%',
        right: '12%',
        bottom: '2%',
        top: '4%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#64748B',
          fontSize: 11,
          fontFamily: 'JetBrains Mono'
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: top10.map((a) => a.name),
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#F8FAFC',
          fontWeight: 600,
          fontSize: 12,
          fontFamily: 'Space Grotesk',
          formatter: (val) => (val && val.length > 18 ? `${val.slice(0, 18)}...` : val)
        }
      },
      series: [
        {
          name: sortBy === 'plays' ? 'Plays' : 'Hours',
          type: 'bar',
          data: top10.map((a) =>
            sortBy === 'plays' ? a.plays : parseFloat((a.ms / (1000 * 60 * 60)).toFixed(1))
          ),
          barMaxWidth: 20,
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#8A2BE2' },
                { offset: 1, color: '#00FFA3' }
              ]
            }
          },
          label: {
            show: true,
            position: 'right',
            color: '#00FFA3',
            fontWeight: 'bold',
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            formatter: (params) =>
              sortBy === 'plays'
                ? `${Number(params.value).toLocaleString()} plays`
                : `${params.value}h`
          }
        }
      ]
    };
  }, [top10, sortBy]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="section-label block mb-1">Section 02 // Artists</span>
          <h2 className="section-title">Your Artist Pantheon</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 1. Bar Chart */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--accent-primary)]" />
              <h3 className="font-display font-bold text-lg text-white">
                Top 10 Ranked Artists
              </h3>
            </div>

            {/* Toggle buttons above chart: 'By Plays' / 'By Hours' */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSortBy('plays')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  sortBy === 'plays'
                    ? 'bg-[var(--accent-primary)] text-black shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>By Plays</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('hours')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  sortBy === 'hours'
                    ? 'bg-[var(--accent-primary)] text-black shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>By Hours</span>
              </button>
            </div>
          </div>

          <div className="h-80 w-full">
            <ReactECharts
              option={barChartOption}
              notMerge={true}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* 2. Superfan Spotlight */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="badge-shimmer">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Your #1 Artist</span>
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-black font-extrabold text-2xl shadow-xl shadow-[var(--accent-primary)]/20 mb-3">
                #1
              </div>
              <h3 className="font-syne text-2xl font-extrabold text-white tracking-tight">
                {topArtist?.name || 'No Artist Data'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-body">
                {topArtist?.tracks
                  ? `Streamed ${topArtist.tracks.size} distinct tracks across your listening sessions.`
                  : 'Reigning at the pinnacle of your listening universe.'}
              </p>
            </div>

            {/* Stats in font-mono */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Play className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Total Plays</span>
                </div>
                <p className="font-mono text-xl font-bold text-white">
                  {topArtistPlays.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                  <span>Total Hours</span>
                </div>
                <p className="font-mono text-xl font-bold text-white">
                  {topArtistHours} hrs
                </p>
              </div>
            </div>
          </div>

          {/* One-Hit Wonder note if available */}
          {stats.funStats?.oneHitWonders && stats.funStats.oneHitWonders.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-[var(--accent-cyan)] font-bold tracking-wider">
                🎯 Personal One-Hit Wonder
              </span>
              <p className="text-xs text-white font-medium">
                <strong>{stats.funStats.oneHitWonders[0].name}</strong> (
                {stats.funStats.oneHitWonders[0].plays} plays of 1 single song)
              </p>
            </div>
          )}
        </div>

        {/* 3. Expandable Artist List (Only show when showAll is true) */}
        {showAll && (
          <div className="glass-panel p-6 col-span-12 space-y-4 animate-fadeInUp">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--accent-primary)]" />
                  <h3 className="font-syne font-bold text-lg text-white">
                    Complete Artist Pantheon
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Displaying all {fullArtistList.length} artists ranked by{' '}
                  {sortBy === 'plays' ? 'play count' : 'listening hours'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="btn-secondary text-xs py-1.5 px-3.5 flex items-center gap-1.5"
              >
                <span>Show Less</span>
                <ChevronUp className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              </button>
            </div>

            {/* Scrollable list of all artists using rank-row */}
            <div className="max-h-[460px] overflow-y-auto space-y-2 pr-2">
              {fullArtistList.map((artist, idx) => {
                const rankClass =
                  idx === 0
                    ? 'rank-1'
                    : idx === 1
                    ? 'rank-2'
                    : idx === 2
                    ? 'rank-3'
                    : 'text-[var(--text-muted)]';
                const artistVal =
                  sortBy === 'plays' ? artist.plays : artist.ms / (1000 * 60 * 60);
                const maxVal =
                  sortBy === 'plays'
                    ? fullArtistList[0]?.plays || 1
                    : (fullArtistList[0]?.ms / (1000 * 60 * 60)) || 1;
                const percent = Math.min(
                  100,
                  Math.max(3, Math.round((artistVal / maxVal) * 100))
                );
                const hours = (artist.ms / (1000 * 60 * 60)).toFixed(1);

                return (
                  <div key={artist.name || idx} className="rank-row">
                    {/* Micro-bar relative background */}
                    <div
                      className="micro-bar bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 w-full flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`rank-number ${rankClass}`}>
                          #{idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-display font-bold text-white text-sm sm:text-base block truncate">
                            {artist.name}
                          </span>
                          {artist.tracks && (
                            <span className="text-[11px] text-[var(--text-muted)] block sm:hidden">
                              {artist.tracks.size} tracks
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                        <span className="text-[var(--accent-primary)] font-bold">
                          {artist.plays.toLocaleString()} plays
                        </span>
                        <span className="text-[var(--text-secondary)] hidden sm:inline">
                          {hours} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="btn-secondary group flex items-center gap-2"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4 text-[var(--accent-primary)] transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* 'View All 50 Artists' toggle button when collapsed */}
        {!showAll && (
          <div className="col-span-12 flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="btn-secondary group flex items-center gap-2 text-xs sm:text-sm font-display font-semibold"
            >
              <BarChart3 className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>
                View All {fullArtistList.length > 10 ? fullArtistList.length : 50} Artists
              </span>
              <ChevronDown className="w-4 h-4 text-[var(--accent-primary)] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
