import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Disc3,
  Hourglass,
  History,
  Award,
  Trophy,
  Share2,
  Check,
  Radio
} from 'lucide-react';

export default function FunStatsSection({ stats }) {
  if (!stats) return null;

  const [copiedBadge, setCopiedBadge] = useState(null);

  // 1. Sonic Archetype data extraction
  const archetypeTitle =
    stats.funStats?.archetype?.title ||
    stats.funStats?.personality ||
    'Sonic Nomad';

  const archetypeDesc =
    stats.funStats?.archetype?.description ||
    stats.funStats?.personalityDesc ||
    'You roam freely across multiple genres, craving fresh discoveries and eclectic vibrations, with an ear tuned to uncharted sonic territory.';

  // 2. Musical Time Machine data extraction
  const dominantEra =
    stats.funStats?.dominantDecade ||
    stats.funStats?.timeMachineYear ||
    stats.decades?.[0]?.decade ||
    '2020s';

  const matchedDecade =
    (stats.decades || []).find((d) => d.decade === dominantEra) ||
    stats.decades?.[0];

  const eraPercent =
    stats.funStats?.dominantDecadeShare ??
    stats.funStats?.decadeShare ??
    matchedDecade?.percent ??
    64;

  // 3. Academic Artist H-Index extraction
  let hIndex = stats.funStats?.hIndex;
  if (typeof hIndex !== 'number' || hIndex <= 0) {
    const sortedArtistPlays = (stats.topArtistsByPlays || [])
      .map((a) => a.plays || 0)
      .sort((a, b) => b - a);
    let calculatedH = 0;
    for (let i = 0; i < sortedArtistPlays.length; i++) {
      if (sortedArtistPlays[i] >= i + 1) {
        calculatedH = i + 1;
      } else {
        break;
      }
    }
    hIndex = calculatedH > 0 ? calculatedH : (stats.uniqueArtists ? Math.min(stats.uniqueArtists, 12) : 12);
  }

  // Handle Share Badge click
  const handleShareBadge = async (badgeType) => {
    const badgePayloads = {
      archetype: {
        title: `MyTaste Sonic Archetype: ${archetypeTitle}`,
        text: `🎧 My Sonic Archetype is "${archetypeTitle}"! ${archetypeDesc} #MyTaste #SonicIdentity`,
      },
      era: {
        title: `MyTaste Musical Time Machine: ${dominantEra}`,
        text: `⏳ My Musical Time Machine: I spiritually belong in the ${dominantEra} (${eraPercent}% of total catalog playback)! #MyTaste #TimeMachine`,
      },
      hIndex: {
        title: `MyTaste Artist H-Index: H-${hIndex}`,
        text: `🏆 Academic Music Citation Score: H-${hIndex}! I have listened to at least ${hIndex} distinct artists at least ${hIndex} times each. #MyTaste #HIndex`,
      },
    };

    const payload = badgePayloads[badgeType] || {
      title: 'MyTaste Sonic Identity',
      text: 'Check out my music recap & sonic identity on MyTaste!',
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${payload.title}\n${payload.text}`);
      setCopiedBadge(badgeType);
      setTimeout(() => {
        setCopiedBadge((curr) => (curr === badgeType ? null : curr));
      }, 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <section className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="section-label">Section 09 // Sonic Identity</span>
          <h2 className="section-title mt-1">Persona, Eras &amp; Acoustic H-Index</h2>
        </div>
      </div>

      {/* 2. 3 Viral Cards in a 3-Column Bento Grid */}
      <div className="dashboard-grid">
        {/* ── CARD 1: Sonic Archetype ── */}
        <div className="glass-panel p-6 col-span-12 md:col-span-4 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent-primary)]/40 transition-all duration-300">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Bar with Badge & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="badge-shimmer">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Sonic Archetype
              </span>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            {/* Emblem / Holographic Visual */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] shrink-0 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.2)]">
                  <Disc3 className="w-6 h-6 animate-spin [animation-duration:8s]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-cyan)] font-semibold block">
                    Algorithmic Profile
                  </span>
                  <p className="font-mono text-xs text-[var(--text-muted)] truncate">
                    Neural Listening Signature
                  </p>
                </div>
              </div>
            </div>

            {/* Archetype Title & Description */}
            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {archetypeTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-body">
                {archetypeDesc}
              </p>
            </div>

            {/* Trait Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--accent-primary)] font-medium">
                High Discovery
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--accent-cyan)] font-medium">
                Genre Fluid
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-purple-300 font-medium">
                Sonic Nomad
              </span>
            </div>
          </div>

          {/* Share Trigger Button */}
          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => handleShareBadge('archetype')}
              className="btn-secondary w-full justify-center group/btn text-xs py-2.5 hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer"
            >
              {copiedBadge === 'archetype' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-scaleUp" />
                  <span className="text-[var(--accent-primary)] font-bold font-mono">
                    Badge Copied!
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover/btn:text-[var(--accent-primary)] transition-colors" />
                  <span className="font-display font-medium text-white">Share Badge</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── CARD 2: Musical Time Machine ── */}
        <div className="glass-panel p-6 col-span-12 md:col-span-4 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent-secondary)]/40 transition-all duration-300">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[var(--accent-secondary)]/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Bar with Badge & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="badge-purple">
                <Hourglass className="w-3.5 h-3.5" />
                Time Machine
              </span>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#C084FC] group-hover:scale-110 transition-transform">
                <History className="w-5 h-5" />
              </div>
            </div>

            {/* Vintage Cassette / Vinyl Styling Card */}
            <div className="my-5 rounded-2xl bg-black/40 border border-white/15 p-3.5 relative overflow-hidden shadow-inner">
              {/* Tape screws in corners */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />

              {/* Cassette Header Bar */}
              <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase border-b border-white/10 pb-2 mb-2.5 px-2">
                <span className="text-[var(--accent-secondary)] font-bold">TYPE II • CrO₂</span>
                <span>SIDE A // STEREO</span>
                <span className="text-amber-400">120µs EQ</span>
              </div>

              {/* Spool Reels & Magnetic Tape Window */}
              <div className="flex items-center justify-between px-2 py-1">
                {/* Left Spool */}
                <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#C084FC]/60 flex items-center justify-center bg-white/5 relative shadow-[0_0_10px_rgba(138,43,226,0.2)]">
                  <div className="w-3 h-3 rounded-full bg-[#C084FC]/70" />
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-spin [animation-duration:12s]" />
                </div>

                {/* Tape Bridge / Center Window */}
                <div className="flex-1 mx-3 h-6 bg-black/60 rounded-md border border-white/15 flex items-center justify-center relative px-2">
                  <div className="w-full h-1 bg-amber-600/40 rounded-full" />
                  <span className="absolute text-[8px] font-mono text-[#C084FC] font-semibold tracking-wider">
                    ANALOG GROOVE
                  </span>
                </div>

                {/* Right Spool */}
                <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#C084FC]/60 flex items-center justify-center bg-white/5 relative shadow-[0_0_10px_rgba(138,43,226,0.2)]">
                  <div className="w-3 h-3 rounded-full bg-[#C084FC]/70" />
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-spin [animation-duration:12s]" />
                </div>
              </div>
            </div>

            {/* Dominant Era Heading & Stats */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-stat text-5xl sm:text-6xl text-white tracking-wider leading-none">
                  {dominantEra}
                </h3>
                <span className="text-xs font-mono font-bold text-[#C084FC] bg-[#C084FC]/15 border border-[#C084FC]/30 px-2.5 py-1 rounded-lg">
                  {eraPercent}% Share
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-body">
                Spiritually anchored in the {dominantEra}. The production aesthetic and melodies of this era make up {eraPercent}% of your overall listening catalog.
              </p>

              {/* Progress Bar of Era Dominance */}
              <div className="pt-2">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-cyan)] rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(12, eraPercent))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Retro Badge Pills */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-purple-300 font-medium">
                Vintage Fidelity
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300 font-medium">
                Golden Age Era
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--accent-cyan)] font-medium">
                Hi-Fi Catalog
              </span>
            </div>
          </div>

          {/* Share Trigger Button */}
          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => handleShareBadge('era')}
              className="btn-secondary w-full justify-center group/btn text-xs py-2.5 hover:border-[var(--accent-secondary)]/40 transition-all cursor-pointer"
            >
              {copiedBadge === 'era' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C084FC] animate-scaleUp" />
                  <span className="text-[#C084FC] font-bold font-mono">
                    Badge Copied!
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover/btn:text-[#C084FC] transition-colors" />
                  <span className="font-display font-medium text-white">Share Badge</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── CARD 3: Academic Artist H-Index ── */}
        <div className="glass-panel p-6 col-span-12 md:col-span-4 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Bar with Badge & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="badge-neon !bg-amber-500/10 !text-amber-300 !border-amber-500/30">
                <Award className="w-3.5 h-3.5" />
                Academic Citation
              </span>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            {/* Certificate Style Plaque */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-amber-500/[0.02] border border-amber-500/30 relative overflow-hidden shadow-inner">
              {/* Notary / Header seal marks */}
              <div className="flex items-center justify-between text-[9px] font-mono text-amber-400/80 uppercase tracking-wider border-b border-amber-500/20 pb-2 mb-3">
                <span>CITATION INDEX // v2.6</span>
                <span className="font-bold text-amber-300">NOTARIZED METRIC</span>
              </div>

              {/* Large .font-stat Score */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-stat text-6xl sm:text-7xl text-amber-300 tracking-tight leading-none">
                  {hIndex}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    H-Factor
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Acoustic Scholar Score
                  </span>
                </div>
              </div>

              {/* Core Citation Sentence */}
              <p className="text-xs text-amber-100/90 leading-relaxed font-body">
                You have listened to at least{' '}
                <strong className="text-white font-mono font-bold underline decoration-amber-400/50">
                  {hIndex} artists
                </strong>{' '}
                at least{' '}
                <strong className="text-white font-mono font-bold underline decoration-amber-400/50">
                  {hIndex} times each
                </strong>
                .
              </p>

              {/* Explanatory Footnote on Music H-Index */}
              <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-[10px] font-mono text-[var(--text-muted)] leading-relaxed">
                Adapted from Jorge E. Hirsch&apos;s scientific citation metric: filters out passive algorithmic autoplay to quantify true artist loyalty and catalog breadth.
              </div>
            </div>

            {/* Trait Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300 font-medium">
                Deep Repertoire
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--accent-primary)] font-medium">
                Curator Devotion
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--text-secondary)] font-medium">
                Sustained Plays
              </span>
            </div>
          </div>

          {/* Share Trigger Button */}
          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => handleShareBadge('hIndex')}
              className="btn-secondary w-full justify-center group/btn text-xs py-2.5 hover:border-amber-400/40 transition-all cursor-pointer"
            >
              {copiedBadge === 'hIndex' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400 animate-scaleUp" />
                  <span className="text-amber-400 font-bold font-mono">
                    Badge Copied!
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover/btn:text-amber-400 transition-colors" />
                  <span className="font-display font-medium text-white">Share Badge</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
