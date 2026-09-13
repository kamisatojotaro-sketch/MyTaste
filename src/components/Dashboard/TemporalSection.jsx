import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Sparkles,
  Activity
} from 'lucide-react';

const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayNamesFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TemporalSection({ stats }) {
  if (!stats) return null;

  // Safe matrix fallback (7 days x 24 hours)
  const matrix = useMemo(() => {
    if (Array.isArray(stats?.hourDayMatrix) && stats.hourDayMatrix.length === 7) {
      return stats.hourDayMatrix;
    }
    return Array.from({ length: 7 }, () => new Array(24).fill(0));
  }, [stats?.hourDayMatrix]);

  // Safe hourly fallback (24 hours)
  const hourly = useMemo(() => {
    if (Array.isArray(stats?.hourlyDistribution) && stats.hourlyDistribution.length === 24) {
      return stats.hourlyDistribution;
    }
    const agg = new Array(24).fill(0);
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        agg[h] += matrix[d]?.[h] || 0;
      }
    }
    return agg;
  }, [stats?.hourlyDistribution, matrix]);

  // Total streams for accurate density percentages
  const totalStreams = useMemo(() => {
    const sum = hourly.reduce((a, b) => a + b, 0);
    return sum > 0 ? sum : (stats?.totalStreams || 0);
  }, [hourly, stats?.totalStreams]);

  // Time formatter helpers
  const formatHour12 = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH} ${period}`;
  };

  const formatHourRange = (h) => {
    const start = formatHour12(h);
    const nextH = (h + 1) % 24;
    const end = formatHour12(nextH);
    const start24 = `${h.toString().padStart(2, '0')}:00`;
    const end24 = `${nextH.toString().padStart(2, '0')}:00`;
    return `${start} – ${end} (${start24} – ${end24})`;
  };

  // 1. Transform 7x24 matrix for Mon-Sun ordering (matrix index 0 is Sunday, 1 is Monday ... 6 is Saturday)
  const { heatmapData, maxHeatmapVal, hottestCell, dayTotals } = useMemo(() => {
    const data = [];
    let max = 0;
    let peakVal = -1;
    let peakDayIdx = 0;
    let peakHour = 0;
    const totalsByDay = new Array(7).fill(0);

    for (let d = 0; d < 7; d++) {
      // Row 0 = Mon (1), Row 1 = Tue (2) ... Row 6 = Sun (0)
      const matrixDay = d === 6 ? 0 : d + 1;
      const row = matrix[matrixDay] || [];
      for (let h = 0; h < 24; h++) {
        const val = row[h] || 0;
        data.push([h, d, val]);
        totalsByDay[d] += val;
        if (val > max) max = val;
        if (val > peakVal) {
          peakVal = val;
          peakDayIdx = d;
          peakHour = h;
        }
      }
    }

    return {
      heatmapData: data,
      maxHeatmapVal: max > 0 ? max : 1,
      hottestCell: {
        day: dayNamesFull[peakDayIdx],
        dayShort: dayNamesShort[peakDayIdx],
        hour: peakHour,
        hourLabel: formatHour12(peakHour),
        count: Math.max(peakVal, 0)
      },
      dayTotals: totalsByDay
    };
  }, [matrix]);

  // 2. High-level temporal insights (Peak Day, Peak Hour, Weekday vs Weekend)
  const temporalInsights = useMemo(() => {
    let maxDayIdx = 0;
    let maxDayVal = -1;
    dayTotals.forEach((val, idx) => {
      if (val > maxDayVal) {
        maxDayVal = val;
        maxDayIdx = idx;
      }
    });

    const weekdayStreams = dayTotals[0] + dayTotals[1] + dayTotals[2] + dayTotals[3] + dayTotals[4];
    const weekendStreams = dayTotals[5] + dayTotals[6];
    const weekTotal = weekdayStreams + weekendStreams;

    const weekdayPct = weekTotal > 0 ? Math.round((weekdayStreams / weekTotal) * 100) : 71;
    const weekendPct = weekTotal > 0 ? 100 - weekdayPct : 29;

    let maxHIdx = 0;
    let maxHVal = -1;
    hourly.forEach((val, idx) => {
      if (val > maxHVal) {
        maxHVal = val;
        maxHIdx = idx;
      }
    });

    return {
      peakDayName: dayNamesFull[maxDayIdx],
      peakDayStreams: maxDayVal,
      peakHourIndex: maxHIdx,
      peakHourDisplay: formatHour12(maxHIdx),
      weekdayPct,
      weekendPct
    };
  }, [dayTotals, hourly]);

  // 3. User Chronotype Behavioral Breakdown
  const chronotype = useMemo(() => {
    // Night Owl: 8 PM – 4 AM (hours 20, 21, 22, 23, 0, 1, 2, 3)
    const nightHours = [20, 21, 22, 23, 0, 1, 2, 3];
    const nightCount = nightHours.reduce((sum, h) => sum + (hourly[h] || 0), 0);

    // Early Bird: 4 AM – 12 PM (hours 4, 5, 6, 7, 8, 9, 10, 11)
    const morningHours = [4, 5, 6, 7, 8, 9, 10, 11];
    const morningCount = morningHours.reduce((sum, h) => sum + (hourly[h] || 0), 0);

    // Midday Flow: 12 PM – 5 PM (hours 12, 13, 14, 15, 16)
    const afternoonHours = [12, 13, 14, 15, 16];
    const afternoonCount = afternoonHours.reduce((sum, h) => sum + (hourly[h] || 0), 0);

    // Twilight / Golden Hour: 5 PM – 8 PM (hours 17, 18, 19)
    const eveningHours = [17, 18, 19];
    const eveningCount = eveningHours.reduce((sum, h) => sum + (hourly[h] || 0), 0);

    const total = totalStreams > 0 ? totalStreams : 1;
    const nightPct = Math.round((nightCount / total) * 100);
    const morningPct = Math.round((morningCount / total) * 100);
    const afternoonPct = Math.round((afternoonCount / total) * 100);
    const eveningPct = Math.round((eveningCount / total) * 100);

    const daytimeCount = afternoonCount + eveningCount;

    let profileKey = 'night';
    if (nightCount >= morningCount && nightCount >= daytimeCount) {
      profileKey = 'night';
    } else if (morningCount > nightCount && morningCount >= daytimeCount) {
      profileKey = 'morning';
    } else if (afternoonCount >= eveningCount) {
      profileKey = 'afternoon';
    } else {
      profileKey = 'evening';
    }

    const profiles = {
      night: {
        id: 'night',
        phaseName: 'Night Phase',
        title: 'Night Owl Profile',
        badgeLabel: 'Night Owl Habit',
        tag: 'Nocturnal Melophile',
        timeWindow: '8 PM and 4 AM',
        percent: nightPct,
        count: nightCount,
        headline: `Night Owl Profile: ${nightPct}% of music consumed between 8 PM and 4 AM`,
        shortHeadline: 'Nocturnal intensity spikes when distractions fade',
        narrative: 'Your sonic appetite peaks when darkness falls. You rely heavily on music during late-night hours for deep focus, nocturnal creative sessions, or quiet midnight decompression.',
        badgeClass: 'badge-purple',
        Icon: Moon,
        color: 'var(--accent-secondary)',
        accentColor: '#8A2BE2',
        rgb: '138, 43, 226'
      },
      morning: {
        id: 'morning',
        phaseName: 'Morning Phase',
        title: 'Early Bird Profile',
        badgeLabel: 'Early Bird Habit',
        tag: 'Sunrise Melophile',
        timeWindow: '4 AM and 12 PM',
        percent: morningPct,
        count: morningCount,
        headline: `Early Bird Profile: ${morningPct}% of music consumed between 4 AM and 12 PM`,
        shortHeadline: 'Dawn momentum fueling daily routines',
        narrative: 'You start your sonic day alongside the rising sun. Morning listening powers your wake-up rituals, commutes, and earliest bursts of daily focus before midday chaos arrives.',
        badgeClass: 'badge-neon',
        Icon: Sunrise,
        color: 'var(--accent-cyan)',
        accentColor: '#00F5D4',
        rgb: '0, 245, 212'
      },
      afternoon: {
        id: 'afternoon',
        phaseName: 'Afternoon Phase',
        title: 'Midday Dynamo Profile',
        badgeLabel: 'Midday Dynamo Habit',
        tag: 'Workday Flow State',
        timeWindow: '12 PM and 5 PM',
        percent: afternoonPct,
        count: afternoonCount,
        headline: `Midday Dynamo Profile: ${afternoonPct}% of music consumed between 12 PM and 5 PM`,
        shortHeadline: 'Afternoon momentum powering peak productivity',
        narrative: 'Your listening surges right into the heartbeat of the day. You lean on audio to sustain concentration, power through workday tasks, and beat the afternoon slump.',
        badgeClass: 'badge-neon',
        Icon: Sun,
        color: 'var(--accent-primary)',
        accentColor: '#00FFA3',
        rgb: '0, 255, 163'
      },
      evening: {
        id: 'evening',
        phaseName: 'Evening Phase',
        title: 'Twilight Melophile Profile',
        badgeLabel: 'Twilight Melophile Habit',
        tag: 'Golden Hour Transition',
        timeWindow: '5 PM and 8 PM',
        percent: eveningPct,
        count: eveningCount,
        headline: `Twilight Melophile Profile: ${eveningPct}% of music consumed between 5 PM and 8 PM`,
        shortHeadline: 'Sunset decompression and evening recharge',
        narrative: 'Your sonic sanctuary begins as daylight fades. You use music to transition from professional demands into personal relaxation, social gatherings, or dinner soundscapes.',
        badgeClass: 'badge-shimmer',
        Icon: Sunset,
        color: 'var(--accent-warm)',
        accentColor: '#FF7A00',
        rgb: '255, 122, 0'
      }
    };

    const dominant = profiles[profileKey];

    const phases = [
      {
        name: 'Night Phase',
        profileName: 'Night Owl Window',
        hoursLabel: '8 PM – 4 AM',
        count: nightCount,
        percent: nightPct,
        avgPerHour: Math.round(nightCount / 8),
        icon: Moon,
        color: '#8A2BE2'
      },
      {
        name: 'Morning Phase',
        profileName: 'Early Bird Window',
        hoursLabel: '4 AM – 12 PM',
        count: morningCount,
        percent: morningPct,
        avgPerHour: Math.round(morningCount / 8),
        icon: Sunrise,
        color: '#00F5D4'
      },
      {
        name: 'Afternoon Phase',
        profileName: 'Midday Flow Window',
        hoursLabel: '12 PM – 5 PM',
        count: afternoonCount,
        percent: afternoonPct,
        avgPerHour: Math.round(afternoonCount / 5),
        icon: Sun,
        color: '#00FFA3'
      },
      {
        name: 'Evening Phase',
        profileName: 'Golden Hour Window',
        hoursLabel: '5 PM – 8 PM',
        count: eveningCount,
        percent: eveningPct,
        avgPerHour: Math.round(eveningCount / 3),
        icon: Sunset,
        color: '#FF7A00'
      }
    ];

    return {
      ...dominant,
      phases
    };
  }, [hourly, totalStreams]);

  // 4. Polar Clock: 24-hour cycle partitioned into 4 diurnal quadrants (Night, Morning, Afternoon, Evening)
  const polarPartitions = useMemo(() => {
    let nightStreams = 0;
    let morningStreams = 0;
    let afternoonStreams = 0;
    let eveningStreams = 0;

    for (let h = 0; h < 24; h++) {
      const c = hourly[h] || 0;
      if (h < 6) nightStreams += c;
      else if (h < 12) morningStreams += c;
      else if (h < 18) afternoonStreams += c;
      else eveningStreams += c;
    }

    const total = totalStreams > 0 ? totalStreams : 1;

    return [
      {
        name: 'Night',
        range: '00:00 – 06:00',
        color: '#8A2BE2',
        streams: nightStreams,
        percent: Math.round((nightStreams / total) * 100),
        icon: Moon
      },
      {
        name: 'Morning',
        range: '06:00 – 12:00',
        color: '#00F5D4',
        streams: morningStreams,
        percent: Math.round((morningStreams / total) * 100),
        icon: Sunrise
      },
      {
        name: 'Afternoon',
        range: '12:00 – 18:00',
        color: '#00FFA3',
        streams: afternoonStreams,
        percent: Math.round((afternoonStreams / total) * 100),
        icon: Sun
      },
      {
        name: 'Evening',
        range: '18:00 – 24:00',
        color: '#FF7A00',
        streams: eveningStreams,
        percent: Math.round((eveningStreams / total) * 100),
        icon: Sunset
      }
    ];
  }, [hourly, totalStreams]);

  // 5. Heatmap ECharts Configuration (5-stage neon gradient ramp: empty void -> violet -> cyan -> mint -> neon gold)
  const heatmapOption = useMemo(() => {
    const hoursLabels = Array.from({ length: 24 }, (_, i) => {
      const p = i >= 12 ? 'P' : 'A';
      const h = i % 12 === 0 ? 12 : i % 12;
      return `${h}${p}`;
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(14, 17, 26, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 12
        },
        extraCssText: 'box-shadow: 0 12px 32px -5px rgba(0,0,0,0.85); backdrop-filter: blur(20px); border-radius: 12px;',
        formatter: function(params) {
          const [h, d, count] = params.value;
          const dayName = dayNamesFull[d];
          const timeRange = formatHourRange(h);
          const pct = totalStreams > 0 ? ((count / totalStreams) * 100).toFixed(2) : '0.00';
          return `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 170px;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 4px;">
                <span style="font-weight: 700; color: #F8FAFC; font-size: 13px;">${dayName}</span>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00FFA3; background: rgba(0,255,163,0.12); padding: 2px 8px; border-radius: 6px; font-weight: 700;">
                  ${count.toLocaleString()} streams
                </span>
              </div>
              <div style="color: #94A3B8; font-size: 11px; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;">
                ${timeRange}
              </div>
              <div style="font-size: 10px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px; display: flex; justify-content: space-between;">
                <span>Density Contribution</span>
                <span style="color: #CBD5E1; font-family: 'JetBrains Mono', monospace; font-weight: 600;">${pct}%</span>
              </div>
            </div>
          `;
        }
      },
      grid: {
        top: 14,
        left: 38,
        right: 14,
        bottom: 54,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: hoursLabels,
        splitArea: { show: false },
        splitLine: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.08)' }
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#64748B',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
          interval: (idx) => idx % 2 === 0
        }
      },
      yAxis: {
        type: 'category',
        data: dayNamesShort,
        inverse: true,
        splitArea: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#CBD5E1',
          fontSize: 11,
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600
        }
      },
      visualMap: {
        min: 0,
        max: maxHeatmapVal,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 12,
        itemHeight: 180,
        text: ['Peak', 'Void'],
        textStyle: {
          color: '#94A3B8',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace'
        },
        inRange: {
          // 5-stage neon gradient ramp: empty void -> violet -> cyan -> mint -> neon gold
          color: ['#0E111A', '#8A2BE2', '#00F5D4', '#00FFA3', '#CCFF00']
        }
      },
      series: [
        {
          name: 'Listening Heatmap',
          type: 'heatmap',
          data: heatmapData,
          label: { show: false },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#0B0E17',
            borderRadius: 3
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 14,
              shadowColor: 'rgba(0, 255, 163, 0.6)',
              borderColor: '#00FFA3',
              borderWidth: 2
            }
          }
        }
      ]
    };
  }, [heatmapData, maxHeatmapVal, totalStreams]);

  // 6. Polar / Bar Radial Chart Configuration
  const polarOption = useMemo(() => {
    const hoursLabels = [
      '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
      '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
      '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
      '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
    ];

    const polarChartData = hourly.map((val, h) => {
      let color = '#8A2BE2';
      let partName = 'Night';
      if (h >= 6 && h < 12) {
        color = '#00F5D4';
        partName = 'Morning';
      } else if (h >= 12 && h < 18) {
        color = '#00FFA3';
        partName = 'Afternoon';
      } else if (h >= 18) {
        color = '#FF7A00';
        partName = 'Evening';
      }

      return {
        value: val,
        hour: h,
        partition: partName,
        partitionColor: color,
        itemStyle: {
          color: color,
          borderRadius: [4, 4, 0, 0]
        }
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(14, 17, 26, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 12
        },
        extraCssText: 'box-shadow: 0 14px 35px -5px rgba(0,0,0,0.85); backdrop-filter: blur(20px); border-radius: 12px;',
        formatter: function(params) {
          const data = params.data;
          const h = data.hour;
          const val = data.value;
          const partName = data.partition;
          const partColor = data.partitionColor;
          const rangeStr = formatHourRange(h);
          const pct = totalStreams > 0 ? ((val / totalStreams) * 100).toFixed(1) : '0.0';

          return `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 4px;">
                <span style="font-weight: 700; color: #F8FAFC; font-size: 13px;">${rangeStr}</span>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${partColor}; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 999px; font-weight: 700; text-transform: uppercase;">
                  ${partName}
                </span>
              </div>
              <div style="display:flex; align-items:baseline; gap: 6px; margin-top: 4px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 16px; color: #FFF;">
                  ${val.toLocaleString()}
                </span>
                <span style="color: #94A3B8; font-size: 11px;">streams (${pct}% of day)</span>
              </div>
            </div>
          `;
        }
      },
      polar: {
        radius: ['22%', '80%'],
        center: ['50%', '50%']
      },
      angleAxis: {
        type: 'category',
        data: hoursLabels,
        boundaryGap: false,
        startAngle: 90,
        clockwise: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.06)',
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.08)'
          }
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#64748B',
          fontSize: 9,
          fontFamily: 'JetBrains Mono, monospace',
          interval: (idx) => idx % 3 === 0
        }
      },
      radiusAxis: {
        min: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.04)',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'bar',
          coordinateSystem: 'polar',
          data: polarChartData,
          name: 'Streams',
          roundCap: true,
          emphasis: {
            itemStyle: {
              shadowBlur: 14,
              shadowColor: 'rgba(0, 255, 163, 0.6)'
            }
          }
        }
      ]
    };
  }, [hourly, totalStreams]);

  return (
    <section className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="section-label">Section 06 // Chrono-Acoustics</span>
          <h2 className="section-title mt-1">Circadian Listening Rhythm</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
            <span>Diurnal density and temporal habits mapped across 168 hours of the weekly cycle</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={chronotype.badgeClass}>
            <chronotype.Icon className="w-3.5 h-3.5" />
            <span>{chronotype.badgeLabel}</span>
          </span>
          <span className="badge-purple hidden md:inline-flex">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span>Peak: {temporalInsights.peakHourDisplay}</span>
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="dashboard-grid">
        {/* 2. 7x24 Listening Heatmap (col-span-12 lg:col-span-8) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-primary-rgb),0.1)] border border-[rgba(var(--accent-primary-rgb),0.2)] flex items-center justify-center text-[var(--accent-primary)]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">7×24 Listening Density Matrix</h3>
                <p className="text-xs text-[var(--text-muted)]">Monday through Sunday density across 24-hour cycles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-neon">
                Peak: {hottestCell.dayShort} {hottestCell.hourLabel}
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ReactECharts
              option={heatmapOption}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>

        {/* 3. 24-Hour Polar/Radial Clock (col-span-12 lg:col-span-4) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-secondary-rgb),0.1)] border border-[rgba(var(--accent-secondary-rgb),0.2)] flex items-center justify-center text-[var(--accent-secondary)]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">24-Hour Polar Clock</h3>
                <p className="text-xs text-[var(--text-muted)]">Diurnal quadrant cycle</p>
              </div>
            </div>
            <span className="badge-purple">Radial</span>
          </div>

          <div className="h-60 w-full relative">
            <ReactECharts
              option={polarOption}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>

          {/* Quadrant Legend Chips */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]">
            {polarPartitions.map((part) => {
              const PartIcon = part.icon;
              return (
                <div
                  key={part.name}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: part.color }} />
                    <span className="text-[11px] font-medium text-[var(--text-secondary)]">{part.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-white">{part.percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Qualitative Behavioral Banner (col-span-12) */}
        <div className="glass-panel p-5 col-span-12 relative overflow-hidden space-y-5">
          {/* Header & Dominant Chronotype Identity */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `rgba(${chronotype.rgb}, 0.12)`,
                  borderColor: `rgba(${chronotype.rgb}, 0.35)`,
                  color: chronotype.accentColor
                }}
              >
                <chronotype.Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={chronotype.badgeClass}>{chronotype.tag}</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">Temporal Chronotype</span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-2xl text-white tracking-tight">
                  {chronotype.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-3xl leading-relaxed">
                  {chronotype.narrative}
                </p>
              </div>
            </div>

            {/* Quick Stat Callouts */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <div className="px-3.5 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">Peak Intensity</span>
                <span className="text-sm font-mono font-bold text-[var(--accent-primary)]">{temporalInsights.peakHourDisplay}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">Peak Day</span>
                <span className="text-sm font-mono font-bold text-[var(--accent-cyan)]">{temporalInsights.peakDayName}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] text-right hidden sm:block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">Weekday Split</span>
                <span className="text-sm font-mono font-bold text-white">{temporalInsights.weekdayPct}%</span>
              </div>
            </div>
          </div>

          {/* 4 Quadrant Phases Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {chronotype.phases.map((p) => {
              const isDominant = p.name === chronotype.phaseName;
              const PhaseIcon = p.icon;
              return (
                <div
                  key={p.name}
                  className={`relative p-3.5 rounded-xl border transition-all duration-300 overflow-hidden ${
                    isDominant
                      ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(var(--accent-primary-rgb),0.35)] shadow-[0_0_20px_rgba(0,0,0,0.4)]'
                      : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-color)]'
                  }`}
                >
                  {/* Subtle Progress Bar Underlay */}
                  <div
                    className="micro-bar"
                    style={{
                      width: `${Math.max(p.percent, 5)}%`,
                      backgroundColor: p.color,
                      opacity: isDominant ? 0.18 : 0.08
                    }}
                  />

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PhaseIcon className="w-4 h-4 shrink-0" style={{ color: p.color }} />
                      <span className="text-xs font-bold text-white tracking-wide">{p.name}</span>
                    </div>
                    {isDominant && (
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[rgba(var(--accent-primary-rgb),0.15)] text-[var(--accent-primary)] font-bold">
                        Dominant
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-[var(--text-muted)] font-mono">{p.hoursLabel}</span>
                    <span className="font-mono font-black text-lg text-white">{p.percent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                    <span>{p.count.toLocaleString()} streams</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {p.avgPerHour} / hr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
