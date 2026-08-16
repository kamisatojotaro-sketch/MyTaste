import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Mic2, Trophy, Clock, Sparkles } from 'lucide-react';

export default function ArtistsSection({ stats }) {
  const [metric, setMetric] = useState('plays'); // 'plays' or 'duration'

  if (!stats) return null;

  const artistsList = metric === 'plays' ? stats.topArtistsByPlays.slice(0, 10) : stats.topArtistsByDuration.slice(0, 10);
  const maxVal = metric === 'plays' ? artistsList[0]?.plays || 1 : (artistsList[0]?.ms / (1000 * 60 * 60)) || 1;

  // Horizontal Bar chart
  const barChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#11141F',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#FFF' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#64748B', fontSize: 11 }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: artistsList.map(a => a.name),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#F8FAFC', fontWeight: 600, fontSize: 12 }
    },
    series: [
      {
        name: metric === 'plays' ? 'Plays' : 'Hours',
        type: 'bar',
        data: artistsList.map(a => metric === 'plays' ? a.plays : parseFloat((a.ms / (1000 * 60 * 60)).toFixed(1))),
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
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
          fontFamily: 'JetBrains Mono'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-secondary)] uppercase tracking-wider font-semibold">
            Section 02 // Artist Intelligence
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Top Artists & Discographies
          </h2>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setMetric('plays')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metric === 'plays' ? 'bg-[var(--accent-primary)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            By Plays
          </button>
          <button
            onClick={() => setMetric('duration')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              metric === 'duration' ? 'bg-[var(--accent-primary)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            By Hours
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Top 10 Chart */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">
              Top 10 Ranked Artists
            </h3>
            <span className="badge-neon">
              #1 {artistsList[0]?.name}
            </span>
          </div>

          <div className="h-80 w-full">
            <ReactECharts option={barChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Artist Superfan Spotlight */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div>
            <span className="badge-purple">Top Superfan Tier</span>
            <div className="mt-4 space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-cyan)] flex items-center justify-center text-black font-extrabold text-2xl shadow-xl shadow-[var(--accent-primary)]/20">
                #1
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                {artistsList[0]?.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                You streamed {artistsList[0]?.tracks.size} distinct songs by {artistsList[0]?.name}.
              </p>
            </div>
          </div>

          {/* One-Hit Wonders in your library */}
          {stats.funStats.oneHitWonders && stats.funStats.oneHitWonders.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono text-[var(--accent-cyan)] font-bold">
                🎯 Personal One-Hit Wonder
              </span>
              <p className="text-xs text-white font-medium">
                <strong>{stats.funStats.oneHitWonders[0].name}</strong> ({stats.funStats.oneHitWonders[0].plays} plays of 1 single song)
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
