import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Disc3,
  Headphones,
  Film,
  Music,
  Layers,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Shuffle,
  Zap,
  Radio
} from 'lucide-react';

export default function CrossPlatformSection({ stats }) {
  if (!stats) return null;

  // 1. Safe extraction of platform stream counts from stats
  const platformCounts = useMemo(() => {
    const raw = stats.platformSplit || stats.platformBreakdown || {};
    if (Array.isArray(raw)) {
      const counts = { spotify: 0, youtube_music: 0, youtube: 0, apple_music: 0 };
      raw.forEach((item) => {
        const key = (item.platform || item.key || item.name || '')
          .toLowerCase()
          .replace(/\s+/g, '_');
        if (key in counts) {
          counts[key] = item.count ?? item.value ?? item.plays ?? 0;
        }
      });
      return counts;
    }

    return {
      spotify: raw.spotify ?? raw.Spotify ?? 0,
      youtube_music: raw.youtube_music ?? raw['YouTube Music'] ?? raw.yt_music ?? 0,
      youtube: raw.youtube ?? raw.YouTube ?? 0,
      apple_music: raw.apple_music ?? raw['Apple Music'] ?? raw.apple ?? 0
    };
  }, [stats]);

  // Total streams across the four monitored ecosystems
  const totalPlatformStreams = useMemo(() => {
    const sum = Object.values(platformCounts).reduce((acc, curr) => acc + curr, 0);
    return sum > 0 ? sum : (stats.totalStreams || 0);
  }, [platformCounts, stats.totalStreams]);

  // 2. Structured platform metadata and calculated percentage shares
  const platforms = useMemo(() => {
    const items = [
      {
        id: 'spotify',
        name: 'Spotify',
        brandColor: '#1DB954',
        gradientStart: '#0d7334',
        icon: Disc3,
        streams: platformCounts.spotify,
        role: 'Algorithmic Flow & Daily Study',
        badgeDefault: 'Algorithmic',
        usageDetail: 'Curated Daily Mixes, Discover Weekly, and seamless background focus playlists.'
      },
      {
        id: 'youtube_music',
        name: 'YouTube Music',
        brandColor: '#FF0033',
        gradientStart: '#99001f',
        icon: Headphones,
        streams: platformCounts.youtube_music,
        role: 'Underground Cuts & Niche Mixtapes',
        badgeDefault: 'Deep Catalog',
        usageDetail: 'Rare bootlegs, soundcloud-era imports, and community audio uploads.'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        brandColor: '#FF0000',
        gradientStart: '#990000',
        icon: Film,
        streams: platformCounts.youtube,
        role: 'Live Sets, Bootlegs & Video Audio',
        badgeDefault: 'Live & Visual',
        usageDetail: 'Festival live recordings, Boiler Room DJ sessions, and acoustic visual performances.'
      },
      {
        id: 'apple_music',
        name: 'Apple Music',
        brandColor: '#FA243C',
        gradientStart: '#941423',
        icon: Music,
        streams: platformCounts.apple_music,
        role: 'Lossless Masters & Album Plays',
        badgeDefault: 'Lossless Master',
        usageDetail: 'Dedicated 24-bit ALAC front-to-back LP sessions and Dolby Atmos spatial staging.'
      }
    ];

    const safeTotal = totalPlatformStreams > 0 ? totalPlatformStreams : 1;
    return items.map((p) => ({
      ...p,
      percentage: totalPlatformStreams > 0 ? (p.streams / safeTotal) * 100 : 0
    }));
  }, [platformCounts, totalPlatformStreams]);

  // Identify highest streaming platform
  const dominantPlatform = useMemo(() => {
    return [...platforms].sort((a, b) => b.streams - a.streams)[0];
  }, [platforms]);

  // Active platform count
  const activePlatforms = useMemo(() => {
    return platforms.filter((p) => p.streams > 0);
  }, [platforms]);

  const activeCount = activePlatforms.length;

  // 3. Platform Diversity Score & Archetype (e.g. 'Multi-Platform Audiophile' if 2+ platforms active)
  const diversityProfile = useMemo(() => {
    if (activeCount >= 2) {
      const isTriOrQuad = activeCount >= 3;
      return {
        title: 'Multi-Platform Audiophile',
        badgeClass: isTriOrQuad ? 'badge-shimmer' : 'badge-neon',
        scorePct: isTriOrQuad ? 94 : 78,
        ratingText: isTriOrQuad ? 'Omni-Channel Synthesis' : 'Dual-Ecosystem Voyager',
        description:
          'High catalog versatility — fluidly balancing algorithmic curation, live video archives, and studio-grade audio masters without streaming siloes.'
      };
    }

    if (activeCount === 1) {
      return {
        title: 'Platform Specialist',
        badgeClass: 'badge-purple',
        scorePct: 42,
        ratingText: 'Single Hub Concentration',
        description:
          'Ecosystem purist — channeling the bulk of streaming hours into a primary dedicated audio application.'
      };
    }

    return {
      title: 'Connecting Streams',
      badgeClass: 'badge-neon',
      scorePct: 0,
      ratingText: 'Standby Telemetry',
      description: 'Waiting for multi-platform streaming logs to synchronize timeline telemetry.'
    };
  }, [activeCount]);

  // 4. Horizontal ECharts Breakdown Configuration
  const echartsOption = useMemo(() => {
    // Show in bottom-to-top order for horizontal display
    const ordered = [
      platforms.find((p) => p.id === 'apple_music'),
      platforms.find((p) => p.id === 'youtube'),
      platforms.find((p) => p.id === 'youtube_music'),
      platforms.find((p) => p.id === 'spotify')
    ].filter(Boolean);

    const categories = ordered.map((p) => p.name);
    const seriesData = ordered.map((p) => ({
      value: p.streams,
      percentage: p.percentage,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: p.gradientStart },
            { offset: 1, color: p.brandColor }
          ]
        },
        borderRadius: [0, 8, 8, 0]
      }
    }));

    const maxVal = Math.max(...ordered.map((p) => p.streams), 10);

    return {
      backgroundColor: 'transparent',
      animationDuration: 900,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(14, 17, 26, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 12
        },
        extraCssText:
          'backdrop-filter: blur(16px); border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.65);',
        formatter: (params) => {
          const item = params[0];
          const platform = ordered[item.dataIndex];
          return `
            <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${platform.brandColor};"></span>
              <span>${platform.name}</span>
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #CBD5E1;">
              ${Number(item.value).toLocaleString()} streams
              <span style="color: #64748B; margin-left: 4px;">(${platform.percentage.toFixed(1)}%)</span>
            </div>
          `;
        }
      },
      grid: {
        top: 10,
        right: 60,
        bottom: 15,
        left: 95,
        containLabel: false
      },
      xAxis: {
        type: 'value',
        max: Math.ceil(maxVal * 1.18),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#CBD5E1',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 11,
          fontWeight: 600
        }
      },
      series: [
        {
          name: 'Streams',
          type: 'bar',
          barWidth: 14,
          data: seriesData,
          label: {
            show: true,
            position: 'right',
            formatter: (params) => {
              const p = ordered[params.dataIndex];
              return `${Number(params.value).toLocaleString()}`;
            },
            color: '#94A3B8',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            fontWeight: 600
          }
        }
      ]
    };
  }, [platforms]);

  return (
    <section className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="section-label block mb-1">Section 08 // Ecosystem</span>
          <h2 className="section-title">Cross-Platform Migration & Split</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-neon">
            <Radio className="w-3 h-3 text-[var(--accent-primary)] animate-pulse" />
            4 Ecosystems Monitored
          </span>
        </div>
      </div>

      {/* 2. Platform Breakdown Grid (4 columns / cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => {
          const IconComponent = p.icon;
          const isDominant = dominantPlatform && dominantPlatform.id === p.id && p.streams > 0;
          const isActive = p.streams > 0;

          return (
            <div
              key={p.id}
              className="glass-panel glass-panel-interactive p-5 border-l-4 relative overflow-hidden flex flex-col justify-between"
              style={{ borderLeftColor: p.brandColor }}
            >
              {/* Micro-bar background accent fill */}
              <div
                className="micro-bar"
                style={{
                  width: `${Math.max(p.percentage, p.streams > 0 ? 4 : 0)}%`,
                  backgroundColor: p.brandColor
                }}
              />

              {/* Card Top: Brand Icon + Title + Status Badge */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0"
                    style={{ color: p.brandColor }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white leading-tight">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {p.role}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {isDominant ? (
                  <span className="badge-neon shrink-0">Primary Hub</span>
                ) : isActive ? (
                  <span className="badge-purple shrink-0">{p.badgeDefault}</span>
                ) : (
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    Standby
                  </span>
                )}
              </div>

              {/* Card Middle: Streams Stat & Percentage Share */}
              <div className="relative z-10 my-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-stat text-3xl sm:text-4xl text-white tracking-wide leading-none">
                    {p.streams.toLocaleString()}
                  </div>
                  <div className="text-right">
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: p.brandColor }}
                    >
                      {p.percentage.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                      share
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-body">
                  Recorded streaming events
                </p>
              </div>

              {/* Card Bottom: Inline Segment Micro-bar */}
              <div className="relative z-10 pt-2 border-t border-white/5">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(p.percentage, p.streams > 0 ? 3 : 0)}%`,
                      backgroundColor: p.brandColor
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 & 4. Ecosystem Overlap & Synergy Card + Platform Share Bar Breakdown */}
      <div className="dashboard-grid">
        {/* 3. Ecosystem Overlap & Synergy Card (col-span-12 lg:col-span-7) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-primary)]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Ecosystem Overlap & Behavioral Synergy
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Cross-catalog intelligence & platform-differentiated intent
                </p>
              </div>
            </div>

            <span className={diversityProfile.badgeClass}>
              <Sparkles className="w-3.5 h-3.5" />
              {diversityProfile.title}
            </span>
          </div>

          {/* Platform Diversity Score Callout Banner */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider">
                  Platform Diversity Score
                </span>
                <span className="text-xs text-[var(--text-muted)]">•</span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {activeCount} Active {activeCount === 1 ? 'Platform' : 'Platforms'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-lg">
                {diversityProfile.description}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="font-stat text-3xl sm:text-4xl text-gradient-primary leading-none">
                {diversityProfile.scorePct}%
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wide">
                {diversityProfile.ratingText}
              </span>
            </div>
          </div>

          {/* Differentiated Listening Intent Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              <span>Platform Behavioral Specialization</span>
              <span>Primary Function</span>
            </div>

            <div className="space-y-2.5">
              {/* Spotify Row */}
              <div className="rank-row flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1DB954] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm text-white">
                        Spotify
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Work & Commute Focus
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Personalized algorithmic radio, Daily Mixes, and background study flows.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 sm:self-center self-end">
                  <span className="font-mono text-xs text-white font-bold">
                    {platformCounts.spotify.toLocaleString()} plays
                  </span>
                </div>
              </div>

              {/* YouTube & YouTube Music Row */}
              <div className="rank-row flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF0033] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm text-white">
                        YouTube & YT Music
                      </span>
                      <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        Live Sets & Unreleased
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Boiler Room DJ sessions, live festival recordings, soundcloud edits, and visual concert audio.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 sm:self-center self-end">
                  <span className="font-mono text-xs text-white font-bold">
                    {(platformCounts.youtube_music + platformCounts.youtube).toLocaleString()} plays
                  </span>
                </div>
              </div>

              {/* Apple Music Row */}
              <div className="rank-row flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FA243C] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm text-white">
                        Apple Music
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        Lossless Audiophile
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Dedicated album listening, 24-bit/192kHz ALAC fidelity, and Dolby Atmos spatial audio staging.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 sm:self-center self-end">
                  <span className="font-mono text-xs text-white font-bold">
                    {platformCounts.apple_music.toLocaleString()} plays
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Synergy Footnote */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span>
              <strong className="text-white">Unified Timeline Synchronization:</strong> Streams across all connected services are chronologically aligned with zero duplicate count distortion.
            </span>
          </div>
        </div>

        {/* 4. Platform Share Stream/Bar Breakdown (col-span-12 lg:col-span-5) */}
        <div className="glass-panel p-6 col-span-12 lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-secondary)]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Relative Platform Share
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Volume dominance across ecosystem streams
                </p>
              </div>
            </div>
            <span className="badge-purple">Breakdown</span>
          </div>

          {/* Horizontal Segmented Progress Bar */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">Ecosystem Balance</span>
              <span className="text-white font-semibold">
                {totalPlatformStreams.toLocaleString()} Total Streams
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-white/5 overflow-hidden flex p-0.5 gap-1 border border-white/10 shadow-inner">
              {platforms.map((p) => {
                if (p.percentage <= 0) return null;
                return (
                  <div
                    key={p.id}
                    className="h-full rounded-full transition-all duration-700 hover:brightness-125 cursor-pointer relative group"
                    style={{
                      width: `${p.percentage}%`,
                      backgroundColor: p.brandColor,
                      minWidth: '6px'
                    }}
                    title={`${p.name}: ${p.percentage.toFixed(1)}% (${p.streams.toLocaleString()} streams)`}
                  />
                );
              })}
            </div>

            {/* Segmented Legend Chips */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] font-mono"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: p.brandColor }}
                    />
                    <span className="text-[var(--text-secondary)] truncate">{p.name}</span>
                  </div>
                  <span className="font-bold text-white ml-2">
                    {p.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ECharts Horizontal Bar Breakdown */}
          <div className="w-full">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Stream Volume Comparison
            </div>
            <div className="h-44 w-full">
              <ReactECharts
                option={echartsOption}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>

          {/* Dominance Callout Card */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: dominantPlatform?.brandColor || 'var(--accent-primary)' }}
              />
              <span className="text-[var(--text-secondary)]">Dominant Channel:</span>
              <strong className="text-white font-display">
                {dominantPlatform?.name || 'Spotify'}
              </strong>
            </div>
            <span className="font-mono text-[var(--accent-primary)] font-bold">
              {dominantPlatform?.percentage.toFixed(1)}% Share
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
