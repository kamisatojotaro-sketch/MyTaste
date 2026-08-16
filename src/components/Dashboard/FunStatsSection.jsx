import React from 'react';
import { Sparkles, Compass, Award, Hourglass } from 'lucide-react';

export default function FunStatsSection({ stats }) {
  if (!stats) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-cyan)] uppercase tracking-wider font-semibold">
            Section 09 // Viral & Deep Insights
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Personality, Time Machine & H-Index
          </h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Listening Personality */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4 border-[var(--border-highlight)]">
          <div className="flex items-center justify-between">
            <span className="badge-neon">Sonic Archetype</span>
            <Compass className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h3 className="font-display font-black text-2xl text-white">
              {stats.funStats.personality}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              {stats.funStats.personalityDesc}
            </p>
          </div>
        </div>

        {/* Musical Time Machine */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-purple">Time Machine</span>
            <Hourglass className="w-5 h-5 text-[var(--accent-secondary)]" />
          </div>
          <div>
            <h3 className="font-display font-black text-2xl text-white">
              Spiritually in the {stats.funStats.timeMachineYear}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              Your listening habits lean heavily towards iconic tracks from this era.
            </p>
          </div>
        </div>

        {/* Artist H-Index */}
        <div className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-neon">Academic Citation</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-display font-black text-4xl text-white font-mono">
                {stats.funStats.hIndex}
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">H-Score</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              You have streamed at least <strong>{stats.funStats.hIndex} distinct artists</strong> at least <strong>{stats.funStats.hIndex} times each</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
