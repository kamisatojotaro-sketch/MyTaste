import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function TemporalSection({ stats }) {
  if (!stats) return null;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Transform 7x24 matrix into ECharts heatmap data format [hourIndex, dayIndex, count]
  const heatmapData = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      heatmapData.push([h, d, stats.hourDayMatrix[d][h]]);
    }
  }

  const maxVal = Math.max(...heatmapData.map(item => item[2]), 1);

  const heatmapOption = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: '#11141F',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#FFF' },
      formatter: function (params) {
        return `${days[params.value[1]]} at ${hours[params.value[0]]}: <b>${params.value[2]} streams</b>`;
      }
    },
    grid: {
      height: '70%',
      top: '10%',
      left: '12%',
      right: '4%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.01)', 'rgba(0,0,0,0.05)'] } },
      axisLabel: { color: '#64748B', fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: '#F8FAFC', fontSize: 11, fontWeight: 500 }
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: { color: '#64748B', fontSize: 10 },
      inRange: {
        color: ['#11141F', '#064e3b', '#00FFA3', '#FEE440']
      }
    },
    series: [
      {
        name: 'Hourly Density',
        type: 'heatmap',
        data: heatmapData,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 255, 163, 0.5)'
          }
        }
      }
    ]
  };

  // Hourly 24-hour radial polar area chart
  const polarOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#11141F',
      textStyle: { color: '#FFF' }
    },
    polar: { radius: [20, '75%'] },
    angleAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: '#64748B', fontSize: 9 }
    },
    radiusAxis: {
      min: 0,
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        type: 'bar',
        data: stats.hourlyDistribution,
        coordinateSystem: 'polar',
        name: 'Streams',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00FFA3' },
              { offset: 1, color: '#8A2BE2' }
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
          <span className="text-[11px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-semibold">
            Section 06 // Circadian Rhythm
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Temporal & Weekly Heatmaps
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 7x24 Heatmap */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">7×24 Day vs. Hour Density Matrix</h3>
            <span className="badge-neon">Peak Hours</span>
          </div>
          <div className="h-80 w-full">
            <ReactECharts option={heatmapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 24-hr Circadian Polar Clock */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white">24-Hour Listening Clock</h3>
            <span className="badge-purple">Radial</span>
          </div>
          <div className="h-80 w-full">
            <ReactECharts option={polarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
