import React from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Headphones, 
  Clock, 
  Flame, 
  Calendar, 
  Disc, 
  Layers, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function OverviewSection({ stats }) {
  if (!stats) return null;

  // Donut chart option for Platform Split
  const platformChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#11141F',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#FFF' },
      formatter: '{b}: {c} streams ({d}%)'
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: { color: '#94A3B8', fontSize: 11 }
    },
    series: [
      {
        name: 'Platform',
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#08090D',
          borderWidth: 3
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#FFF'
          }
        },
        data: [
          { value: stats.platformSplit.spotify, name: 'Spotify', itemStyle: { color: '#1DB954' } },
          { value: stats.platformSplit.youtube_music, name: 'YouTube Music', itemStyle: { color: '#FF0000' } },
          { value: stats.platformSplit.youtube, name: 'YouTube', itemStyle: { color: '#FF4B4B' } },
          { value: stats.platformSplit.apple_music, name: 'Apple Music', itemStyle: { color: '#FA243C' } }
        ].filter(d => d.value > 0)
      }
    ]
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase tracking-wider font-semibold">
            Section 01 // Master Overview
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Listening Vital Signs
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Hero Card: Total Listening Time */}
        <div className="glass-panel p-6 col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4 border-[var(--border-highlight)] shadow-lg shadow-[var(--accent-primary)]/5">
          <div className="flex items-center justify-between">
            <span className="badge-neon">Cumulative Time</span>
            <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-primary)]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight font-mono">
              {stats.totalHours}
            </h3>
            <p className="font-display font-bold text-sm text-[var(--accent-primary)] uppercase tracking-widest">
              Total Hours Streamed
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Continuous: <strong className="text-white">{stats.totalDaysContinuous} days</strong></span>
            <span>Minutes: <strong className="text-white font-mono">{stats.totalMinutes.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Total Streams & Unique Artists */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-purple">Catalog Depth</span>
            <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-secondary)]">
              <Headphones className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-[var(--text-muted)] uppercase font-mono">Streams</p>
              <h4 className="font-display font-black text-3xl text-white font-mono">
                {stats.totalStreams.toLocaleString()}
              </h4>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)] uppercase font-mono">Artists</p>
              <h4 className="font-display font-black text-3xl text-[var(--accent-cyan)] font-mono">
                {stats.uniqueArtists.toLocaleString()}
              </h4>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Unique Songs: <strong className="text-white font-mono">{stats.uniqueTracks.toLocaleString()}</strong></span>
            <span>Albums: <strong className="text-white font-mono">{stats.uniqueAlbums.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Platform Share Donut Chart */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Platform Distribution
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Unified</span>
          </div>
          <div className="h-44 w-full">
            <ReactECharts option={platformChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Streaks & Peaks */}
        <div className="glass-panel p-5 col-span-12 sm:col-span-6 lg:col-span-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Listening Streak</p>
              <h4 className="font-display font-bold text-xl text-white">
                {stats.streaks.longest} Consecutive Days
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">Current streak: {stats.streaks.current} days</p>
            </div>
          </div>
          <span className="badge-neon !bg-amber-400/10 !text-amber-300 !border-amber-400/30">
            🔥 On Fire
          </span>
        </div>

        {/* Top Listening Day */}
        <div className="glass-panel p-5 col-span-12 sm:col-span-6 lg:col-span-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[var(--accent-cyan)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Peak Day</p>
              <h4 className="font-display font-bold text-xl text-white">
                {new Date(stats.biggestDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">{stats.biggestDay.hours} hrs ({stats.biggestDay.count} songs)</p>
            </div>
          </div>
          <span className="badge-purple">
            👑 Peak
          </span>
        </div>
      </div>
    </section>
  );
}
