import React from 'react';
import ReactECharts from 'echarts-for-react';
import { PieChart, Sparkles, Activity } from 'lucide-react';

export default function GenreSection({ stats }) {
  if (!stats) return null;

  const topGenres = stats.genres.slice(0, 7);

  // Genre Pie Chart option
  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#11141F',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#FFF' },
      formatter: '{b}: {c} plays ({d}%)'
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: { color: '#94A3B8', fontSize: 11 }
    },
    series: [
      {
        name: 'Genres',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '45%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8,
          borderColor: '#08090D',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#FFF' }
        },
        data: topGenres.map((g, i) => {
          const colors = ['#00FFA3', '#8A2BE2', '#00F5D4', '#FF007A', '#FFE600', '#38BDF8', '#F97316'];
          return {
            value: g.count,
            name: g.genre,
            itemStyle: { color: colors[i % colors.length] }
          };
        })
      }
    ]
  };

  // Monthly timeline area chart
  const months = stats.monthlyTimeline.map(m => m.month);
  const monthlyCounts = stats.monthlyTimeline.map(m => m.count);

  const timelineOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#11141F',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#FFF' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#64748B', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#64748B', fontSize: 11 }
    },
    series: [
      {
        name: 'Streams',
        type: 'line',
        smooth: true,
        data: monthlyCounts,
        symbolSize: 6,
        lineStyle: { width: 3, color: '#00FFA3' },
        itemStyle: { color: '#00FFA3' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
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
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-secondary)] uppercase tracking-wider font-semibold">
            Section 05 // Sonic Palette
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Genre Universe & Evolution
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Genre Rose/Pie Chart */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">Genre Proportions</h3>
            <span className="badge-purple">Top 7 Macro Genres</span>
          </div>
          <div className="h-72 w-full">
            <ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Monthly Stream Evolution */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">Monthly Stream Velocity</h3>
            <span className="badge-neon">Activity Trend</span>
          </div>
          <div className="h-72 w-full">
            <ReactECharts option={timelineOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
