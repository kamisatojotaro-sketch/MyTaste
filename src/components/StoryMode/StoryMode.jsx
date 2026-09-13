import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../../context/DataContext.jsx';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Sparkles, 
  Music, 
  Flame, 
  Calendar, 
  Trophy, 
  Layers,
  Heart,
  Headphones,
  Crown,
  Clock,
  Radio,
  RotateCcw,
  Share2,
  Disc3,
  Zap,
  Check,
  Globe
} from 'lucide-react';

export default function StoryMode({ onClose }) {
  const { stats, setViewMode } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cardRef = useRef(null);
  const pointerDownTime = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const SLIDE_DURATION = 6500; // 6.5s per slide
  const TICK_INTERVAL = 40; // 40ms updates for smooth bar

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setViewMode('dashboard');
    }
  }, [onClose, setViewMode]);

  const handleNext = useCallback(() => {
    if (currentSlide < 7) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  }, [currentSlide, handleClose]);

  const handlePrev = useCallback(() => {
    if (progress > 25) {
      setProgress(0);
    } else if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  }, [currentSlide, progress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleClose]);

  // Progress tick timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const step = (TICK_INTERVAL / SLIDE_DURATION) * 100;
        const next = prev + step;
        if (next >= 100) {
          if (currentSlide < 7) {
            setCurrentSlide(c => c + 1);
            return 0;
          } else {
            setIsPaused(true);
            return 100;
          }
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  // Confetti effect on final slide
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00FFA3', '#8A2BE2', '#00F5D4', '#CCFF00', '#FF007A']
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }, []);

  useEffect(() => {
    if (currentSlide === 7) {
      triggerConfetti();
    }
  }, [currentSlide, triggerConfetti]);

  // Pointer interactions (tap vs hold-to-pause)
  const handlePointerDown = (e) => {
    pointerDownTime.current = Date.now();
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    setIsPaused(true);
  };

  const handlePointerUp = (e) => {
    setIsPaused(false);
    const duration = Date.now() - pointerDownTime.current;
    const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);

    // If held for more than 260ms or dragged, it's a hold/drag, NOT a navigation tap
    if (duration > 260 || dist > 16) return;

    // If click was on an interactive control, don't navigate story
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-no-nav]')) {
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width;

    if (relX < 0.35) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Export current story slide as 9:16 PNG
  const exportSlide = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    setIsPaused(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#050508',
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        ignoreElements: (element) => {
          return element.hasAttribute('data-story-export-ignore');
        }
      });
      const link = document.createElement('a');
      link.download = `MyTaste-Recap-Slide-${currentSlide + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setIsExporting(false);
      setIsPaused(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!stats) return null;

  // Data helpers & fallbacks
  const topArtist = stats.topArtistsByPlays?.[0] || { name: "Your Favorite Artist", plays: 0, ms: 0, tracks: new Set() };
  const topSong = stats.topTracks?.[0] || { title: "Your Soundtrack Anthem", artist: "Featured Artist", plays: 0, album: "" };
  const top5Artists = (stats.topArtistsByPlays || []).slice(0, 5);
  const maxArtistPlays = top5Artists[0]?.plays || 1;
  const biggestDay = stats.biggestDay || { date: new Date().toISOString(), hours: "0", count: 0 };
  const personality = stats.funStats?.personality || "The Sonic Explorer";
  const personalityDesc = stats.funStats?.personalityDesc || "You roam freely across multiple genres, craving fresh discoveries and eclectic vibrations.";
  const topGenre = stats.funStats?.topGenre || stats.genres?.[0]?.genre || "Eclectic";
  const timeMachineYear = stats.funStats?.timeMachineYear || "2020s";
  const obsessionPeak = stats.obsessionPeak || stats.funStats?.obsessedSong;

  const formattedBiggestDay = (() => {
    try {
      const d = new Date(biggestDay.date);
      if (isNaN(d.getTime())) return biggestDay.date;
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return biggestDay.date;
    }
  })();

  // 8 Unique Slide Atmospheres & Kinetic Elements
  const slides = [
    // ══════════════════════════════════════════════════════
    // SLIDE 0: INTRO — Cyber Neon Pulsing Aura
    // ══════════════════════════════════════════════════════
    {
      id: 'intro',
      atmosphere: 'radial-gradient(circle at 50% 32%, rgba(0, 255, 163, 0.28) 0%, rgba(138, 43, 226, 0.22) 45%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 animate-scaleUp">
          {/* Pulsing neon headphone core */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-[var(--accent-primary)]/20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[var(--accent-primary)] via-emerald-400 to-[var(--accent-cyan)] flex items-center justify-center shadow-2xl shadow-[var(--accent-primary)]/40 animate-pulseGlow">
              <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-black" strokeWidth={2.5} />
            </div>
          </div>

          {/* Equalizer wave micro-interaction */}
          <div className="equalizer-container !h-5 py-1">
            <div className="equalizer-bar !h-3" />
            <div className="equalizer-bar !h-5" />
            <div className="equalizer-bar !h-4" />
            <div className="equalizer-bar !h-6" />
            <div className="equalizer-bar !h-3" />
          </div>

          <div className="space-y-2 max-w-xs sm:max-w-sm px-2">
            <span className="badge-neon font-mono text-[11px] sm:text-xs tracking-wider">
              ✦ Unified Music Intelligence
            </span>
            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Your Sound. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-cyan)] to-white">
                Decoded.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
              Ready to witness your unified listening journey across all your streaming platforms?
            </p>
          </div>

          {/* Metric Teaser Box */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-xs w-full shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Streams Tracked
              </span>
              <span className="font-bold text-white font-mono text-sm">
                {stats.totalStreams.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span>Tap right to start • Hold to pause</span>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 1: TOTAL TIME — Massive Bebas Neue Stat & Days
    // ══════════════════════════════════════════════════════
    {
      id: 'time',
      atmosphere: 'radial-gradient(circle at 50% 35%, rgba(204, 255, 0, 0.25) 0%, rgba(255, 184, 0, 0.18) 45%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 animate-scaleUp">
          <span className="badge-neon !text-[var(--accent-yellow)] !border-[var(--accent-yellow)]/30 !bg-[var(--accent-yellow)]/10 font-mono text-[11px] sm:text-xs">
            ⚡ Listening Endurance
          </span>

          {/* Giant Bebas Neue Stat */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="font-stat text-8xl sm:text-[116px] leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#CCFF00] via-[#00FFA3] to-white drop-shadow-[0_0_35px_rgba(204,255,0,0.35)] animate-countBounce">
              {stats.totalHours}
            </div>
            <p className="font-syne font-black text-lg sm:text-2xl text-white uppercase tracking-widest">
              Hours of Music
            </p>
          </div>

          {/* Continuous Days Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs w-full shadow-xl space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-mono text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>Continuous Audio Equivalent</span>
            </div>
            <p className="text-white font-medium leading-relaxed">
              That's equal to <strong className="text-[var(--accent-yellow)] font-extrabold text-base">{stats.totalDaysContinuous} full days</strong> of uninterrupted sound without stopping once for sleep.
            </p>
          </div>

          {/* Substat Chips */}
          <div className="grid grid-cols-2 gap-2 max-w-xs w-full font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <span className="text-[10px] uppercase text-[var(--text-muted)] block">Total Minutes</span>
              <span className="font-bold text-white text-sm">{Math.round(stats.totalMinutes).toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <span className="text-[10px] uppercase text-[var(--text-muted)] block">Unique Artists</span>
              <span className="font-bold text-[var(--accent-primary)] text-sm">{stats.uniqueArtists.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 2: TOP DAY / HABIT — Peak Obsession Day
    // ══════════════════════════════════════════════════════
    {
      id: 'biggest_day',
      atmosphere: 'radial-gradient(circle at 50% 30%, rgba(255, 85, 0, 0.3) 0%, rgba(255, 0, 122, 0.22) 45%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-5 animate-scaleUp">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-orange-500/20">
              <Flame className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-xs sm:max-w-sm px-2">
            <span className="badge-purple !bg-amber-500/10 !text-amber-400 !border-amber-500/30 font-mono text-[11px] sm:text-xs">
              🔥 The Obsession Peak
            </span>
            <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-mono pt-1">
              Your Most Intense Listening Day
            </p>
            <h2 className="font-syne font-black text-2xl sm:text-3xl text-white">
              {formattedBiggestDay}
            </h2>
          </div>

          {/* Big Day Highlights */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-xs w-full space-y-2 shadow-xl">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Time Spent</span>
                <span className="font-stat text-3xl sm:text-4xl text-amber-400">{biggestDay.hours} <span className="text-sm font-sans font-bold">hrs</span></span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Tracks Streamed</span>
                <span className="font-stat text-3xl sm:text-4xl text-white">{biggestDay.count}</span>
              </div>
            </div>

            {obsessionPeak && (
              <div className="pt-2 border-t border-white/10 text-left">
                <span className="text-[10px] font-mono uppercase text-orange-300 font-bold block">Top Repeat on Record:</span>
                <p className="text-xs text-white font-medium truncate mt-0.5">
                  ♫ {obsessionPeak.track}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                  Looped {obsessionPeak.count} times in 24 hours
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
            Headphones permanently glued on. Total non-stop sonic momentum.
          </p>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 3: TOP ARTIST — Billboard Crown & Superfan Crest
    // ══════════════════════════════════════════════════════
    {
      id: 'top_artist',
      atmosphere: 'radial-gradient(circle at 50% 28%, rgba(255, 215, 0, 0.25) 0%, rgba(0, 255, 163, 0.2) 45%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-5 animate-scaleUp">
          {/* Crown & Billboard Avatar */}
          <div className="relative flex flex-col items-center">
            <Crown className="w-8 h-8 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] -mb-2 z-10 animate-bounce" style={{ animationDuration: '2.5s' }} />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-[var(--accent-primary)] to-[var(--accent-cyan)] p-1 shadow-2xl shadow-[var(--accent-primary)]/30">
              <div className="w-full h-full rounded-full bg-[#0E111A] flex items-center justify-center">
                <span className="font-syne font-black text-2xl sm:text-3xl text-white">
                  {topArtist.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-black font-stat text-xl flex items-center justify-center shadow-lg border-2 border-[#0E111A]">
                #1
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-xs sm:max-w-sm px-2">
            <span className="badge-shimmer text-amber-300 border-amber-400/40 text-[11px] sm:text-xs">
              👑 Top 0.1% Superfan
            </span>
            <h2 className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {topArtist.name}
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[var(--accent-cyan)] font-bold">
              <span>{topArtist.plays.toLocaleString()} streams</span>
              <span>•</span>
              <span>{(topArtist.ms / (1000 * 60 * 60)).toFixed(1)} hrs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-xs w-full text-xs text-[var(--text-secondary)] shadow-xl">
            <p className="leading-relaxed">
              Your most soundtracked artist across all playlists and late-night sessions.
            </p>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 4: TOP 5 PODIUM — Tiered Leaderboard & Rank Colors
    // ══════════════════════════════════════════════════════
    {
      id: 'top_5_artists',
      atmosphere: 'radial-gradient(circle at 50% 35%, rgba(138, 43, 226, 0.26) 0%, rgba(0, 245, 212, 0.18) 50%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full flex flex-col items-center justify-center space-y-3 sm:space-y-4 animate-scaleUp max-w-xs sm:max-w-sm mx-auto">
          <div className="text-center space-y-1">
            <span className="badge-purple font-mono text-[11px] sm:text-xs">
              The Heavy Rotation
            </span>
            <h3 className="font-syne font-extrabold text-2xl sm:text-3xl text-white">
              Top 5 Artists
            </h3>
          </div>

          <div className="w-full space-y-2 pt-1">
            {top5Artists.map((artist, idx) => {
              const playPercent = Math.max(15, Math.round((artist.plays / maxArtistPlays) * 100));
              const isGold = idx === 0;
              const isGreen = idx === 1;
              const isCyan = idx === 2;

              return (
                <div 
                  key={idx} 
                  className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all overflow-hidden ${
                    isGold 
                      ? 'bg-amber-400/10 border-amber-400/40 shadow-lg shadow-amber-500/10' 
                      : isGreen
                      ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30'
                      : isCyan
                      ? 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Micro Progress Bar Behind */}
                  <div 
                    className="absolute inset-y-0 left-0 opacity-15 pointer-events-none transition-all duration-700"
                    style={{
                      width: `${playPercent}%`,
                      backgroundColor: isGold ? '#FEE440' : isGreen ? 'var(--accent-primary)' : isCyan ? 'var(--accent-cyan)' : 'white'
                    }}
                  />

                  <div className="flex items-center gap-3 truncate z-10">
                    <span className={`font-stat text-xl sm:text-2xl w-6 text-center leading-none ${
                      isGold ? 'text-amber-400' : isGreen ? 'text-[var(--accent-primary)]' : isCyan ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-syne font-bold text-sm sm:text-base text-white truncate">
                      {artist.name}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[var(--text-secondary)] shrink-0 z-10 pl-2">
                    {artist.plays.toLocaleString()} <span className="text-[10px] text-[var(--text-muted)]">plays</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 5: TOP SONG — Vinyl Disc Visualizer & Anthem
    // ══════════════════════════════════════════════════════
    {
      id: 'top_song',
      atmosphere: 'radial-gradient(circle at 50% 30%, rgba(255, 0, 122, 0.28) 0%, rgba(138, 43, 226, 0.22) 50%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-5 animate-scaleUp">
          {/* Animated 360 Vinyl Disc Visualizer */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-xl animate-pulse" />
            
            {/* Spinning Vinyl */}
            <div 
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl border-4 border-[#121212] flex items-center justify-center animate-[spin_10s_linear_infinite]"
              style={{
                background: 'repeating-radial-gradient(circle, #1a1a1a 0px, #1a1a1a 2px, #0f0f0f 3px, #0f0f0f 5px)'
              }}
            >
              {/* Gloss Sheen */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none opacity-25"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.2) 60%, transparent 100%)'
                }}
              />
              {/* Center Vinyl Label */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[var(--accent-secondary)] via-pink-500 to-[var(--accent-primary)] flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-[#050508] border border-white/30" />
              </div>
            </div>

            {/* Note float badge */}
            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-pink-500 text-white shadow-lg border-2 border-[#050508]">
              <Music className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-xs sm:max-w-sm px-2">
            <span className="badge-purple !text-pink-300 !border-pink-500/30 !bg-pink-500/10 font-mono text-[11px] sm:text-xs">
              ✦ Your #1 Anthem
            </span>
            <h2 className="font-syne font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight line-clamp-2 px-1">
              {topSong.title}
            </h2>
            <p className="text-sm font-semibold text-[var(--accent-cyan)]">
              {topSong.artist}
            </p>
            {topSong.album && (
              <p className="text-xs text-[var(--text-muted)] font-mono truncate max-w-xs mx-auto">
                {topSong.album}
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg">
            <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
              {topSong.plays.toLocaleString()} plays on repeat
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
            The track that soundtracked your highest highs and late night reflections.
          </p>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 6: SONIC ARCHETYPE — Holographic Persona Card
    // ══════════════════════════════════════════════════════
    {
      id: 'personality',
      atmosphere: 'radial-gradient(circle at 50% 35%, rgba(0, 245, 212, 0.24) 0%, rgba(247, 37, 133, 0.2) 45%, rgba(121, 40, 202, 0.18) 75%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-5 animate-scaleUp">
          {/* Persona Holographic Badge */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[var(--accent-primary)] via-cyan-400 to-[var(--accent-secondary)] p-0.5 shadow-2xl shadow-cyan-500/20">
              <div className="w-full h-full rounded-[22px] bg-[#0E111A] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[var(--accent-cyan)] animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-xs sm:max-w-sm px-2">
            <span className="badge-shimmer text-cyan-300 border-cyan-400/40 text-[11px] sm:text-xs">
              🔮 Sonic Archetype
            </span>
            <h2 className="font-syne font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 leading-tight">
              {personality}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed pt-1">
              {personalityDesc}
            </p>
          </div>

          {/* Archetype DNA Pills */}
          <div className="grid grid-cols-3 gap-1.5 max-w-xs w-full text-center font-mono">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase text-[var(--text-muted)] block">Top Genre</span>
              <span className="text-xs font-bold text-white truncate block">{topGenre}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase text-[var(--text-muted)] block">Dominant Era</span>
              <span className="text-xs font-bold text-[var(--accent-primary)] block">{timeMachineYear}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] uppercase text-[var(--text-muted)] block">Discovery</span>
              <span className="text-xs font-bold text-[var(--accent-cyan)] block">
                {Math.round((stats.uniqueArtists / stats.totalStreams) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )
    },

    // ══════════════════════════════════════════════════════
    // SLIDE 7: BENTO SUMMARY — Final Share Card with Confetti
    // ══════════════════════════════════════════════════════
    {
      id: 'summary',
      atmosphere: 'radial-gradient(circle at 50% 35%, rgba(0, 255, 163, 0.22) 0%, rgba(138, 43, 226, 0.22) 40%, rgba(0, 245, 212, 0.15) 70%, rgba(5, 5, 8, 0.95) 85%)',
      render: () => (
        <div className="w-full flex flex-col items-center justify-center space-y-3 animate-scaleUp max-w-xs sm:max-w-sm mx-auto">
          {/* Brand Header */}
          <div className="text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-[var(--accent-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-syne font-black text-lg text-white tracking-tight">
                MyTaste Recap 2026
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">
              YOUR UNIFIED MUSIC DNA
            </p>
          </div>

          {/* 2x2 Bento Metrics */}
          <div className="grid grid-cols-2 gap-2 w-full text-left font-mono">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[9px] uppercase text-[var(--text-muted)] block">Listening Time</span>
              <p className="font-stat text-2xl text-[var(--accent-primary)] leading-none">{stats.totalHours} <span className="text-xs font-sans">hrs</span></p>
              <span className="text-[10px] text-[var(--text-muted)] block">≈ {stats.totalDaysContinuous} days non-stop</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[9px] uppercase text-[var(--text-muted)] block">Total Plays</span>
              <p className="font-stat text-2xl text-white leading-none">{stats.totalStreams.toLocaleString()}</p>
              <span className="text-[10px] text-[var(--accent-cyan)] block">{stats.uniqueArtists} unique artists</span>
            </div>
          </div>

          {/* Key Favorites Row */}
          <div className="grid grid-cols-2 gap-2 w-full text-left">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[9px] uppercase font-mono text-amber-400 font-bold block flex items-center gap-1">
                <Crown className="w-3 h-3" /> #1 Artist
              </span>
              <p className="font-syne font-bold text-xs text-white truncate">{topArtist.name}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">{topArtist.plays.toLocaleString()} plays</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[9px] uppercase font-mono text-pink-400 font-bold block flex items-center gap-1">
                <Music className="w-3 h-3" /> #1 Track
              </span>
              <p className="font-syne font-bold text-xs text-white truncate">{topSong.title}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">{topSong.plays.toLocaleString()} plays</span>
            </div>
          </div>

          {/* Compact Top 5 Summary */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-full text-left space-y-1">
            <span className="text-[9px] uppercase font-mono text-[var(--accent-cyan)] font-bold block">
              Top 5 Heavy Rotation
            </span>
            <div className="space-y-0.5">
              {top5Artists.map((a, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium truncate text-[11px]">{i + 1}. {a.name}</span>
                  <span className="text-[var(--text-muted)] font-mono text-[10px] shrink-0">{a.plays}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Strip */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 via-purple-500/10 to-pink-500/10 border border-[var(--border-highlight)] w-full text-left flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono text-[var(--accent-primary)] font-bold block">
                Sonic Persona
              </span>
              <p className="font-syne font-black text-xs text-white truncate">{personality}</p>
            </div>
            <button
              onClick={triggerConfetti}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Replay Confetti"
              data-no-nav
            >
              🎉
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none p-2 sm:p-4">
      {/* Large Hit-Area Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 min-w-[48px] min-h-[48px] rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white transition-all shadow-xl backdrop-blur-md flex items-center justify-center border border-white/10 focus:outline-none"
        aria-label="Close story recap"
        title="Close Recap (Esc)"
        data-no-nav
      >
        <X className="w-6 h-6" />
      </button>

      {/* 9:16 Story Card Container */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-[420px] h-[94dvh] max-h-[820px] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col justify-between p-4 sm:p-6 transition-all duration-500"
        style={{
          background: slides[currentSlide].atmosphere
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsPaused(false)}
      >
        {/* Top Progress Indicators */}
        <div className="flex items-center gap-1.5 z-30 pt-1" data-story-export-ignore>
          {slides.map((_, idx) => {
            const isCompleted = idx < currentSlide;
            const isCurrent = idx === currentSlide;
            const currentWidth = isCompleted ? 100 : isCurrent ? progress : 0;

            return (
              <div key={idx} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent-primary)] transition-all duration-75 ease-linear rounded-full"
                  style={{ width: `${currentWidth}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Center Content Slide with responsive no-scrollbar wrapper */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-0 w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 sm:py-4 px-1">
          {slides[currentSlide].render()}
        </div>

        {/* Bottom Story Navigation & Action Controls */}
        <div 
          className="z-30 flex items-center justify-between pt-3 border-t border-white/10 gap-2"
          data-story-export-ignore
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={exportSlide}
              disabled={isExporting}
              className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5 font-mono"
              title="Save clean 9:16 Story Card PNG"
              data-no-nav
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{isExporting ? "Saving..." : "Save Card"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              title="Copy link"
              data-no-nav
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClose}
              className="btn-primary !py-2 !px-4 text-xs font-bold"
              data-no-nav
            >
              <span>{currentSlide === 7 ? "Open Dashboard" : "Skip"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
