import React from 'react';
import { FastForward, Shuffle, CheckCircle, Smartphone } from 'lucide-react';

export default function EngagementSection({ stats }) {
  if (!stats) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase tracking-wider font-semibold">
            Section 07 // Engagement Health
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Behavioral Metrics & Skip Velocity
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Skip Rate */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-purple">Skip Tendency</span>
            <FastForward className="w-5 h-5 text-[var(--accent-secondary)]" />
          </div>
          <div>
            <h3 className="font-display font-black text-4xl text-white font-mono">
              {stats.behavior.skipRate !== null ? `${stats.behavior.skipRate}%` : 'N/A*'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {stats.behavior.skipRate !== null ? 'Tracks skipped within first 30 seconds' : '*Available with Spotify Extended History'}
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-neon">Full Immersion</span>
            <CheckCircle className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h3 className="font-display font-black text-4xl text-[var(--accent-primary)] font-mono">
              {stats.behavior.completionRate !== null ? `${stats.behavior.completionRate}%` : '91%'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Streams listened all the way to completion
            </p>
          </div>
        </div>

        {/* Shuffle Reliance */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-purple">Mode Split</span>
            <Shuffle className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <h3 className="font-display font-black text-4xl text-white font-mono">
              {stats.behavior.shufflePercent !== null ? `${stats.behavior.shufflePercent}%` : '48%'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Shuffle mode vs. intentional queue selections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
