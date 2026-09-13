import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Layers, TrendingUp } from 'lucide-react';

const PALETTE = ['#00FFA3', '#8A2BE2', '#FF007A', '#00F5D4', '#CCFF00', '#FF5500', '#38BDF8'];

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function GenreSection({ stats }) {
  if (!stats) return null;

  // Extract genre breakdown data (fallback to stats.genres if genreBreakdown is not set)
  const rawGenres = stats.genreBreakdown || stats.genres || [];
  const genres = rawGenres.map(g => ({
    name: g.genre || g.name || 'Unknown',
    count: g.count ?? g.value ?? 0
  }));

  const topGenres = genres.slice(0, 7);

  // Nightingale Rose Chart Configuration
  const roseOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0E111A',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#F8FAFC',
        fontSize: 12
      },
      formatter: params => {
        return `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};box-shadow:0 0 6px ${params.color};"></span>
            <span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:#FFF;font-size:13px;">${params.name}</span>
          </div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#94A3B8;padding-left:16px;">
            Plays: <span style="color:#00FFA3;font-weight:600;">${Number(params.value).toLocaleString()}</span>
            <span style="color:#64748B;margin-left:6px;">(${params.percent}%)</span>
          </div>
        `;
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Genres',
        type: 'pie',
        radius: ['20%', '76%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8,
          borderColor: '#08090D',
          borderWidth: 2
        },
        label: {
          show: true,
          color: '#CBD5E1',
          fontSize: 11,
          fontFamily: 'Space Grotesk, sans-serif',
          formatter: '{b}'
        },
        labelLine: {
          show: true,
          smooth: 0.2,
          length: 10,
          length2: 14,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.25)'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 255, 163, 0.4)'
          },
          label: {
            show: true,
            fontWeight: 'bold',
            color: '#FFFFFF'
          }
        },
        data: topGenres.map((g, i) => ({
          value: g.count,
          name: g.name,
          itemStyle: {
            color: PALETTE[i % PALETTE.length]
          }
        }))
      }
    ]
  };

  // Monthly Timeline Area Chart Configuration
  const monthlyTimeline = stats.monthlyTimeline || [];
  const monthLabels = monthlyTimeline.map(m => m.month || m.name || m.date || '');
  const monthlyCounts = monthlyTimeline.map(m => m.count ?? m.streams ?? m.plays ?? m.value ?? 0);

  const timelineOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0E111A',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#F8FAFC',
        fontSize: 12
      },
      formatter: params => {
        const p = params[0];
        if (!p) return '';
        return `
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#94A3B8;margin-bottom:4px;">
            ${p.name}
          </div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;color:#00FFA3;">
            ${Number(p.value).toLocaleString()} <span style="font-size:12px;font-weight:normal;color:#CBD5E1;">streams</span>
          </div>
        `;
      }
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthLabels,
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.12)' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.06)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#64748B',
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace'
      }
    },
    series: [
      {
        name: 'Streams',
        type: 'line',
        smooth: true,
        data: monthlyCounts,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#00FFA3'
        },
        itemStyle: {
          color: '#00FFA3',
          borderColor: '#08090D',
          borderWidth: 2
        },
        emphasis: {
          scale: 1.4,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: '#00FFA3'
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 163, 0.4)' },
              { offset: 1, color: 'rgba(0, 255, 163, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="section-label">Section 05 // Genres</span>
          <h2 className="section-title mt-1">Genre Universe & Evolution</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 2. Nightingale Rose Chart */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-cyan)]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Genre Proportions
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-body">
                  Nightingale rose distribution
                </p>
              </div>
            </div>
            <span className="badge-purple">Top Macro Genres</span>
          </div>

          <div className="h-80 w-full">
            <ReactECharts
              option={roseOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* 3. Monthly Timeline */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-primary)]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Monthly Stream Velocity
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-body">
                  Playback evolution over time
                </p>
              </div>
            </div>
            <span className="badge-neon">Activity Trend</span>
          </div>

          <div className="h-80 w-full">
            <ReactECharts
              option={timelineOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>

        {/* 4. Genre Pills Row */}
        <div className="glass-panel p-6 col-span-12 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-primary)]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Genre Breakdown
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-body">
                  Distinct sonic classifications in your library
                </p>
              </div>
            </div>
            <span className="badge-neon font-mono">
              {genres.length} Genres
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {genres.map((g, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              return (
                <span
                  key={`${g.name}-${idx}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono inline-flex items-center gap-2 border transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: hexToRgba(color, 0.12),
                    borderColor: hexToRgba(color, 0.3),
                    color: '#F8FAFC'
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 6px ${color}`
                    }}
                  />
                  <span className="font-medium">{g.name}</span>
                  <span
                    className="font-semibold text-[11px]"
                    style={{ color: color }}
                  >
                    {g.count.toLocaleString()}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
