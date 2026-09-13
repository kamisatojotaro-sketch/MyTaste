import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Activity,
  Users,
  ListMusic,
  Flame,
  Calendar,
  Clock
} from 'lucide-react';

export default function OverviewSection({ stats }) {
  if (!stats) return null;

  // 1. Calculate Peak Hour from stats.hourlyDistribution
  const peakHour = useMemo(() => {
    const hourly = stats.hourlyDistribution;
    if (!hourly || !Array.isArray(hourly) || hourly.length === 0) {
      return { hour: 0, count: 0, label: '12 AM', description: 'Evenly distributed listening activity across the day.' };
    }

    let maxIdx = 0;
    let maxVal = -1;
    hourly.forEach((val, idx) => {
      if (val > maxVal) {
        maxVal = val;
        maxIdx = idx;
      }
    });

    const h = maxIdx % 24;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const label = `${displayH} ${period}`;

    let description = "Late-night sonic voyager — your peak frequency spikes during the quietest midnight hours.";
    if (h >= 5 && h < 12) {
      description = "Morning momentum builder — your audio sessions fuel early wake-up routines and sunrise productivity.";
    } else if (h >= 12 && h < 17) {
      description = "Midday groove captain — streaming volume surges to power your afternoon flow state.";
    } else if (h >= 17 && h < 22) {
      description = "Evening decompression ritual — high-volume listening marks your transition into personal evening hours.";
    }

    return { hour: maxIdx, count: maxVal, label, description };
  }, [stats.hourlyDistribution]);

  // 2. Safe extract of metric values
  const totalStreams = stats.totalStreams ?? 0;
  const uniqueArtists = stats.uniqueArtists ?? 0;
  const uniqueSongs = stats.uniqueSongs ?? stats.uniqueTracks ?? 0;
  const currentStreak = stats.currentStreak ?? stats.streaks?.current ?? stats.streaks?.longest ?? 0;

  // 3. Platform Breakdown Donut Chart
  const platformBreakdown = stats.platformBreakdown ?? stats.platformSplit ?? {};

  const platformChartOption = useMemo(() => {
    const platformDefs = [
      { key: 'spotify', name: 'Spotify', color: '#1DB954' },
      { key: 'youtube', name: 'YouTube', color: '#FF0000' },
      { key: 'youtube_music', name: 'YouTube Music', color: '#FF0033' },
      { key: 'apple_music', name: 'Apple Music', color: '#FA243C' }
    ];

    let chartData = [];
    if (Array.isArray(platformBreakdown)) {
      chartData = platformBreakdown.map(item => {
        const match = platformDefs.find(
          p => p.key === item.platform || p.name.toLowerCase() === (item.name || '').toLowerCase()
        );
        return {
          name: item.name || match?.name || item.platform,
          value: item.count ?? item.value ?? 0,
          itemStyle: { color: match?.color || item.color || '#00FFA3' }
        };
      });
    } else {
      chartData = platformDefs.map(p => ({
        name: p.name,
        value: platformBreakdown[p.key] || 0,
        itemStyle: { color: p.color }
      }));
    }

    const filteredData = chartData.filter(d => d.value > 0);
    const displayStreams = totalStreams > 0 ? totalStreams : filteredData.reduce((acc, cur) => acc + cur.value, 0);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(14, 17, 26, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 12
        },
        extraCssText: 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.6);',
        formatter: (params) => {
          return `
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 4px;">
              <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${params.color};"></span>
              <span>${params.name}</span>
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #CBD5E1;">
              ${params.value.toLocaleString()} streams <span style="color: #64748B;">(${params.percent}%)</span>
            </div>
          `;
        }
      },
      legend: {
        bottom: '2%',
        left: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 16,
        textStyle: {
          color: '#94A3B8',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 11
        }
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: displayStreams.toLocaleString(),
            textAlign: 'center',
            fill: '#FFFFFF',
            font: 'bold 26px "Bebas Neue", sans-serif'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '51%',
          style: {
            text: 'TOTAL STREAMS',
            textAlign: 'center',
            fill: '#64748B',
            font: '600 10px "JetBrains Mono", monospace',
            letterSpacing: 1
          }
        }
      ],
      series: [
        {
          name: 'Platform Breakdown',
          type: 'pie',
          radius: ['55%', '78%'],
          center: ['50%', '46%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0E111A',
            borderWidth: 3
          },
          label: {
            show: false
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: {
              shadowBlur: 14,
              shadowColor: 'rgba(0, 0, 0, 0.6)'
            }
          },
          data: filteredData.length > 0 ? filteredData : [{ name: 'No Platform Data', value: 1, itemStyle: { color: '#334155' } }]
        }
      ]
    };
  }, [platformBreakdown, totalStreams]);

  // 4. Formatted Best Day Date
  const formattedBestDate = useMemo(() => {
    const rawDate = stats.biggestDay?.date;
    if (!rawDate || rawDate === 'N/A') return 'No Record';
    try {
      const [y, m, d] = rawDate.split('-');
      if (!y || !m || !d) return rawDate;
      const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
      return dateObj.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return rawDate;
    }
  }, [stats.biggestDay?.date]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div>
        <span className="section-label">Section 01 // Overview</span>
        <h2 className="section-title mt-1">Your Listening Universe</h2>
      </div>

      {/* Bento Grid Layout */}
      <div className="dashboard-grid">
        {/* 1. Hero Card: Total Listening Time */}
        <div className="glass-panel-hero p-6 min-h-[280px] col-span-12 lg:col-span-8 flex flex-col justify-between relative overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="badge-shimmer">All-Time Crown</span>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-primary)]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Center Stat */}
          <div className="my-auto py-4 z-10">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Total Listening Time
            </p>
            <div className="font-stat text-6xl sm:text-7xl text-[var(--accent-primary)] leading-none tracking-tight">
              {Math.round((stats.totalMinutes || 0) / 60).toLocaleString()} hours
            </div>
            <p className="font-mono text-sm text-[var(--text-secondary)] mt-3">
              {(stats.totalMinutes || 0).toLocaleString()} minutes • {((stats.totalMinutes || 0) / 1440).toFixed(1)} continuous days
            </p>
          </div>

          {/* Bottom Ambient Glow Blob */}
          <div
            className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'var(--accent-primary)', opacity: 0.1 }}
          />
        </div>

        {/* 2. Peak Hour Card */}
        <div className="glass-panel p-6 min-h-[280px] col-span-12 lg:col-span-4 flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <span className="badge-purple">Circadian Peak</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Center Stat */}
          <div className="my-auto py-4">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Peak Hourly Frequency
            </p>
            <div className="font-stat text-5xl text-white leading-none tracking-wide">
              {peakHour.label}
            </div>
            <p className="text-xs text-[var(--accent-cyan)] font-mono mt-2">
              {peakHour.count.toLocaleString()} streams logged
            </p>
          </div>

          {/* Bottom Description */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {peakHour.description}
            </p>
          </div>
        </div>

        {/* 3. 4 Metric Cards */}
        {/* Card A: Total Streams */}
        <div className="glass-panel glass-panel-interactive p-5 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)]">
            <Activity className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-stat text-3xl text-white tracking-wide leading-none">
              {totalStreams.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Total Streams
            </div>
          </div>
        </div>

        {/* Card B: Unique Artists */}
        <div className="glass-panel glass-panel-interactive p-5 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-stat text-3xl text-white tracking-wide leading-none">
              {uniqueArtists.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Unique Artists
            </div>
          </div>
        </div>

        {/* Card C: Unique Songs */}
        <div className="glass-panel glass-panel-interactive p-5 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ListMusic className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-stat text-3xl text-white tracking-wide leading-none">
              {uniqueSongs.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Unique Songs
            </div>
          </div>
        </div>

        {/* Card D: Streak */}
        <div className="glass-panel glass-panel-interactive p-5 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-stat text-3xl text-white tracking-wide leading-none">
              {currentStreak} days
            </div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Streak
            </div>
          </div>
        </div>

        {/* 4. Platform Donut Card */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">Platform Breakdown</h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">Multi-Platform Ecosystem</p>
            </div>
            <span className="badge-neon">Unified</span>
          </div>

          <div className="h-64 w-full">
            <ReactECharts
              option={platformChartOption}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* 5. Best Day Card */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 flex flex-col justify-between min-h-[280px] space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <span className="badge-neon">Peak Record</span>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Center Content */}
          <div className="my-auto py-2 space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Most Active Day in History
            </p>
            <div className="font-stat text-5xl sm:text-6xl text-white leading-none tracking-wide">
              {(stats.biggestDay?.count ?? 0).toLocaleString()} <span className="text-2xl sm:text-3xl text-[var(--accent-cyan)]">streams</span>
            </div>
            <p className="font-display font-bold text-lg sm:text-xl text-white pt-2">
              {formattedBestDate}
            </p>
          </div>

          {/* Bottom Info */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Playback: <strong className="text-white font-mono">{stats.biggestDay?.hours ?? '0.0'} hrs</strong></span>
            <span className="font-mono text-[var(--accent-primary)] font-semibold">Single-Day High</span>
          </div>
        </div>
      </div>
    </section>
  );
}
