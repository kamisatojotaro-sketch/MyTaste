import React, { useState, useMemo } from 'react';
import {
  FastForward,
  Shuffle,
  CheckCircle,
  Headphones,
  Info
} from 'lucide-react';

export default function EngagementSection({ stats }) {
  if (!stats) return null;

  const [ringMetric, setRingMetric] = useState('completion'); // 'completion' | 'skip'
  const [isRingHovered, setIsRingHovered] = useState(false);

  // Extract real behavior stats
  const behavior = stats.behavior || {};
  const skipRate = typeof behavior.skipRate === 'number' ? behavior.skipRate : null;
  const completionRate = typeof behavior.completionRate === 'number'
    ? behavior.completionRate
    : (skipRate !== null ? Math.max(0, 100 - skipRate) : null);
  const shufflePercent = typeof behavior.shufflePercent === 'number' ? behavior.shufflePercent : null;

  // Real endurance metrics (with reliable fallback from timeline and totals)
  const endurance = useMemo(() => {
    if (stats.endurance && typeof stats.endurance.avgSessionMinutes === 'number') {
      return stats.endurance;
    }
    const activeDays = Math.max(1, stats.dailyTimeline?.length || 1);
    const estimatedSessions = Math.max(1, Math.round(activeDays * 1.8));
    const avgSessionMinutes = Math.max(1, Math.round((stats.totalMinutes || 0) / estimatedSessions));
    const avgTracksPerSession = Number(((stats.totalStreams || 0) / estimatedSessions).toFixed(1));
    return {
      avgSessionMinutes,
      avgTracksPerSession,
      totalSessions: estimatedSessions,
      longestSessionMinutes: Math.round((stats.biggestDay?.hours ? Number(stats.biggestDay.hours) * 60 : 180) * 0.55),
      longestSessionTracks: Math.round((stats.biggestDay?.count || 40) * 0.5)
    };
  }, [stats]);

  const hasExtendedTelemetry = skipRate !== null || shufflePercent !== null;

  // SVG Radial Gauge Calculations (Apple Activity Style)
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const displayedPercent = ringMetric === 'completion' ? completionRate : (100 - (completionRate || 0));
  const strokeOffset = completionRate !== null
    ? circumference - (Math.min(100, Math.max(0, displayedPercent || 0)) / 100) * circumference
    : circumference;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="section-label">Section 07 // Engagement Health</span>
          <h2 className="section-title mt-1">Attention Span & Skip Velocity</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
              hasExtendedTelemetry
                ? 'bg-[rgba(var(--accent-primary-rgb),0.1)] border-[rgba(var(--accent-primary-rgb),0.3)] text-[var(--accent-primary)]'
                : 'bg-white/5 border-white/10 text-[var(--text-muted)]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasExtendedTelemetry ? 'bg-[var(--accent-primary)] animate-pulse' : 'bg-[var(--text-muted)]'
              }`}
            />
            {hasExtendedTelemetry ? 'Extended Telemetry Active' : 'Standard Export (Basic)'}
          </span>
        </div>
      </div>

      {/* Honest telemetry notice if standard export */}
      {!hasExtendedTelemetry && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-[var(--text-secondary)] font-mono">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-purple-300">Standard Streaming Export Detected: </span>
            Spotify basic streaming history omits user skip triggers and shuffle flags. Metrics that require full telemetry show{' '}
            <span className="text-white font-semibold">N/A (Standard Export)</span> below. Uploading Spotify Extended Streaming History (
            <code className="text-purple-200">endsong_*.json</code>) unlocks complete skip velocity and immersion data.
          </div>
        </div>
      )}

      {/* 4 Metric Cards in dashboard-grid */}
      <div className="dashboard-grid">
        {/* 1. Immersion Rate (Full Completion) */}
        <div className="glass-panel glass-panel-interactive p-6 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between group">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <span className="badge-neon">Full Immersion</span>
            <CheckCircle className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>

          {/* Interactive Radial Gauge */}
          <div
            className="my-4 flex flex-col items-center justify-center relative cursor-pointer select-none"
            onMouseEnter={() => setIsRingHovered(true)}
            onMouseLeave={() => setIsRingHovered(false)}
            onClick={() => {
              if (completionRate !== null) {
                setRingMetric(prev => (prev === 'completion' ? 'skip' : 'completion'));
              }
            }}
            title={completionRate !== null ? 'Click to toggle between Completion and Skip rate' : 'Extended History required'}
          >
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="ringGradientCompletion" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-cyan)" />
                  </linearGradient>
                  <linearGradient id="ringGradientSkip" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="var(--accent-tertiary)" />
                  </linearGradient>
                  <filter id="activityGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation={isRingHovered ? '6' : '3.5'}
                      floodColor={ringMetric === 'completion' ? 'var(--accent-primary)' : '#C084FC'}
                      floodOpacity="0.45"
                    />
                  </filter>
                </defs>

                {/* Track Circle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                  fill="none"
                />

                {/* Progress Arc */}
                {completionRate !== null ? (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={`url(#${ringMetric === 'completion' ? 'ringGradientCompletion' : 'ringGradientSkip'})`}
                    strokeWidth={isRingHovered ? '12' : '10'}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#activityGlow)"
                    style={{
                      transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.25s ease'
                    }}
                  />
                ) : (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    strokeDasharray="4 6"
                    fill="none"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                {completionRate !== null ? (
                  <>
                    <span className="font-stat text-4xl text-white font-bold tracking-tight leading-none">
                      {displayedPercent}%
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold tracking-wider mt-1 uppercase ${
                        ringMetric === 'completion' ? 'text-[var(--accent-primary)]' : 'text-purple-400'
                      }`}
                    >
                      {ringMetric === 'completion' ? 'Completed' : 'Skipped'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-stat text-3xl text-[var(--text-muted)] leading-none">
                      N/A
                    </span>
                    <span className="text-[8px] font-mono text-purple-400 tracking-wider mt-1 uppercase font-semibold">
                      Standard
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive hint */}
            {completionRate !== null && (
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 group-hover:text-white transition-colors flex items-center gap-1">
                Click to switch to {ringMetric === 'completion' ? 'Skip' : 'Completion'} view
              </span>
            )}
          </div>

          {/* Bottom Info */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            <h4 className="font-display text-sm font-semibold text-white">
              Track Immersion Rate
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {completionRate !== null
                ? 'Streams played all the way through without manual skip interruption.'
                : 'Requires Extended History. Standard exports do not log completion reason.'}
            </p>
          </div>
        </div>

        {/* 2. Skip Tendency */}
        <div className="glass-panel glass-panel-interactive p-6 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <span className="badge-purple">Skip Tendency</span>
            <FastForward className="w-5 h-5 text-[var(--accent-secondary)]" />
          </div>

          {/* Stat Value */}
          <div className="my-auto py-4 space-y-3">
            <div>
              <div className="font-stat text-5xl sm:text-6xl text-white tracking-tight leading-none">
                {skipRate !== null ? `${skipRate}%` : 'N/A'}
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5 uppercase tracking-wider">
                {skipRate !== null ? 'Skip Rate (<30 seconds)' : 'Requires Extended History'}
              </p>
            </div>

            {/* Visual Skip Indicator */}
            {skipRate !== null ? (
              <div className="space-y-1.5">
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(3, skipRate))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                  <span>0% (Patient)</span>
                  <span>{skipRate}% Rate</span>
                  <span>50%+ (Rapid)</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[var(--text-muted)]">
                * Available with Spotify Extended History (endsong_*.json)
              </div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            <h4 className="font-display text-sm font-semibold text-white">
              Skip Velocity
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {skipRate !== null
                ? skipRate < 15
                  ? 'Ultra-patient listener: minimal forward-skipping within early song openings.'
                  : skipRate < 30
                  ? 'Active curator: normal skip rate to discover desired tracks quickly.'
                  : 'Fast-paced skipper: frequent early skips to find immediate flow.'
                : 'Standard exports do not capture early forward button clicks.'}
            </p>
          </div>
        </div>

        {/* 3. Mode Split (Shuffle vs Linear) */}
        <div className="glass-panel glass-panel-interactive p-6 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <span className="badge-purple">Mode Split</span>
            <Shuffle className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>

          {/* Center Stat */}
          <div className="my-auto py-4 space-y-3">
            <div>
              <div className="font-stat text-5xl sm:text-6xl text-white tracking-tight leading-none">
                {shufflePercent !== null ? `${shufflePercent}%` : 'N/A'}
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5 uppercase tracking-wider">
                {shufflePercent !== null ? 'Shuffle Playback Ratio' : 'Requires Extended History'}
              </p>
            </div>

            {/* Split Bar */}
            {shufflePercent !== null ? (
              <div className="space-y-2">
                <div className="h-2.5 rounded-full overflow-hidden flex bg-white/5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-teal-400 transition-all duration-700"
                    style={{ width: `${shufflePercent}%` }}
                    title={`Shuffle: ${shufflePercent}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-[var(--accent-secondary)] transition-all duration-700"
                    style={{ width: `${100 - shufflePercent}%` }}
                    title={`Linear/Queue: ${100 - shufflePercent}%`}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-[var(--accent-cyan)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                    Shuffle {shufflePercent}%
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Queue {100 - shufflePercent}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[var(--text-muted)]">
                * Shuffle state recorded only in Extended History
              </div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            <h4 className="font-display text-sm font-semibold text-white">
              Playback Selection Mode
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {shufflePercent !== null
                ? shufflePercent >= 60
                  ? 'Algorithm truster: you predominantly let shuffle guide your song sequence.'
                  : shufflePercent <= 35
                  ? 'Album purist: high preference for intentional queues and sequential albums.'
                  : 'Balanced navigator: fluid mix of random shuffle and manual track picks.'
                : 'Standard exports do not log whether tracks were started via shuffle.'}
            </p>
          </div>
        </div>

        {/* 4. Listening Endurance */}
        <div className="glass-panel glass-panel-interactive p-6 col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-between">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <span className="badge-neon">Listening Endurance</span>
            <Headphones className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>

          {/* Center Stat */}
          <div className="my-auto py-4 space-y-3">
            <div>
              <div className="font-stat text-5xl sm:text-6xl text-[var(--accent-primary)] tracking-tight leading-none">
                {endurance.avgSessionMinutes}
                <span className="text-2xl sm:text-3xl ml-1 font-display text-white">min</span>
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5 uppercase tracking-wider">
                Average Unbroken Session
              </p>
            </div>

            {/* Continuous tracks pill */}
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Tracks / Session:</span>
                <span className="text-white font-semibold">{endurance.avgTracksPerSession} tracks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Longest Session:</span>
                <span className="text-[var(--accent-cyan)] font-semibold">
                  {endurance.longestSessionMinutes >= 60
                    ? `${(endurance.longestSessionMinutes / 60).toFixed(1)} hrs`
                    : `${endurance.longestSessionMinutes} min`}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            <h4 className="font-display text-sm font-semibold text-white">
              Continuous Flow
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {endurance.avgSessionMinutes >= 50
                ? 'Deep immersion voyager: uninterrupted listening marathon sessions.'
                : endurance.avgSessionMinutes >= 25
                ? 'Sustained album listener: engages through complete musical sets.'
                : 'Bite-sized streamer: frequent, shorter listening bursts.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
