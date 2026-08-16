import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext.jsx';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Share2, 
  Download, 
  Sparkles, 
  Music, 
  Flame, 
  Calendar, 
  Trophy, 
  Layers,
  Heart,
  Headphones
} from 'lucide-react';

export default function StoryMode({ onClose }) {
  const { stats, events, setViewMode } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

  if (!stats) return null;

  const slides = [
    // Slide 0: Intro
    {
      type: 'intro',
      title: "Ready for your recap?",
      subtitle: "Your unified musical journey",
      render: () => (
        <div className="text-center space-y-6 animate-scaleUp">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-2xl shadow-[var(--accent-primary)]/40 animate-pulse">
            <Headphones className="w-10 h-10 text-black font-extrabold" />
          </div>
          <div className="space-y-2">
            <span className="badge-neon font-mono">MyTaste Recap</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
              Your Sound. <br />Decoded.
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {stats.totalStreams.toLocaleString()} plays across your platforms
            </p>
          </div>
        </div>
      )
    },
    // Slide 1: Total Listening Time
    {
      type: 'time',
      title: "Time Well Spent",
      render: () => (
        <div className="text-center space-y-6 animate-scaleUp">
          <span className="badge-purple">Total Listening</span>
          <div className="space-y-1">
            <h1 className="font-display font-black text-6xl sm:text-7xl text-[var(--accent-primary)] tracking-tighter">
              {stats.totalHours}
            </h1>
            <p className="font-display font-bold text-xl sm:text-2xl text-white uppercase tracking-widest">
              Hours of Music
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
            That's equivalent to <strong className="text-white font-bold">{stats.totalDaysContinuous} full continuous days</strong> of sound.
          </div>
        </div>
      )
    },
    // Slide 2: Biggest Listening Day
    {
      type: 'biggest_day',
      title: "Peak Day",
      render: () => (
        <div className="text-center space-y-6 animate-scaleUp">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-mono">Your Top Listening Day</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              {new Date(stats.biggestDay.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <div className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/10 mt-2">
              <span className="text-sm font-bold text-[var(--accent-cyan)] font-mono">
                {stats.biggestDay.hours} hours ({stats.biggestDay.count} songs)
              </span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
            You were locked in all day and night.
          </p>
        </div>
      )
    },
    // Slide 3: Top Artist
    {
      type: 'top_artist',
      title: "Your #1 Artist",
      render: () => {
        const topArtist = stats.topArtistsByPlays[0] || { name: "Your Favorite Artist", plays: 0 };
        return (
          <div className="text-center space-y-6 animate-scaleUp">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[var(--accent-primary)] via-emerald-400 to-[var(--accent-cyan)] flex items-center justify-center text-black font-extrabold text-3xl shadow-xl shadow-[var(--accent-primary)]/30">
              #1
            </div>
            <div className="space-y-2">
              <span className="badge-neon">Top 0.5% Superfan</span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
                {topArtist.name}
              </h2>
              <p className="text-sm font-mono text-[var(--accent-cyan)] font-bold">
                {topArtist.plays.toLocaleString()} streams
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              Your most soundtracked artist of the year.
            </div>
          </div>
        );
      }
    },
    // Slide 4: Top 5 Artists
    {
      type: 'top_5_artists',
      title: "Top 5 Artists",
      render: () => (
        <div className="space-y-4 animate-scaleUp w-full max-w-xs mx-auto">
          <div className="text-center">
            <span className="badge-purple">The Heavy Rotation</span>
            <h3 className="font-display font-bold text-2xl text-white mt-1">Your Top 5 Artists</h3>
          </div>
          <div className="space-y-2 pt-2">
            {stats.topArtistsByPlays.slice(0, 5).map((artist, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 truncate">
                  <span className="font-mono font-bold text-[var(--accent-primary)] text-sm w-4">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-sm text-white truncate">{artist.name}</span>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono shrink-0">
                  {artist.plays}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 5: Top Song
    {
      type: 'top_song',
      title: "Your Anthem",
      render: () => {
        const topSong = stats.topTracks[0] || { title: "Your Anthem", artist: "Artist", plays: 0 };
        return (
          <div className="text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[var(--accent-secondary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
              <Music className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="badge-purple">Your #1 Most Played Song</span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight px-2">
                {topSong.title}
              </h2>
              <p className="text-sm font-semibold text-[var(--accent-cyan)]">
                {topSong.artist}
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mt-1">
                <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                  {topSong.plays.toLocaleString()} plays
                </span>
              </div>
            </div>
          </div>
        );
      }
    },
    // Slide 6: Listening Personality
    {
      type: 'personality',
      title: "Your Music Persona",
      render: () => (
        <div className="text-center space-y-6 animate-scaleUp">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[var(--accent-primary)] via-cyan-400 to-[var(--accent-secondary)] flex items-center justify-center text-2xl shadow-xl shadow-[var(--accent-primary)]/30">
            🔮
          </div>
          <div className="space-y-2">
            <span className="badge-neon">Sonic Archetype</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              {stats.funStats.personality}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed pt-2">
              {stats.funStats.personalityDesc}
            </p>
          </div>
        </div>
      )
    },
    // Slide 7: Master Bento Summary Card (Final with Confetti)
    {
      type: 'summary',
      title: "Your Master Recap",
      render: () => (
        <div className="space-y-4 animate-scaleUp w-full max-w-sm mx-auto">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[var(--accent-primary)]">
              <Sparkles className="w-4 h-4" />
              <span className="font-display font-bold text-lg tracking-tight text-white">MyTaste Recap</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">2026 Year-Round Music Portrait</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Hours</span>
              <p className="font-display font-black text-xl text-[var(--accent-primary)]">{stats.totalHours}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Streams</span>
              <p className="font-display font-black text-xl text-white">{stats.totalStreams.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
            <span className="text-[10px] uppercase font-mono text-[var(--accent-cyan)] font-bold">Top 5 Artists</span>
            <div className="space-y-1">
              {stats.topArtistsByPlays.slice(0, 5).map((a, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-white font-medium truncate">{i + 1}. {a.name}</span>
                  <span className="text-[var(--text-muted)] font-mono">{a.plays}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--border-highlight)] text-left">
            <span className="text-[10px] uppercase font-mono text-[var(--accent-primary)] font-bold">Persona</span>
            <p className="font-display font-bold text-sm text-white">{stats.funStats.personality}</p>
          </div>
        </div>
      )
    }
  ];

  // Auto-advance timer (6 seconds per slide)
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      }
    }, 6500);

    return () => clearTimeout(timer);
  }, [currentSlide, isPaused]);

  // Trigger confetti on final slide
  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setViewMode('dashboard');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Export current slide as 9:16 PNG image
  const exportSlide = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#08090D',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `MyTaste-Recap-Slide-${currentSlide + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none">
      {/* Close button */}
      <button
        onClick={() => setViewMode('dashboard')}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 9:16 Story Container */}
      <div 
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] rounded-3xl overflow-hidden glass-panel border-white/20 shadow-2xl flex flex-col justify-between p-6 sm:p-8"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        ref={cardRef}
      >
        {/* Top Progress Bars */}
        <div className="flex items-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
              <div 
                className={`h-full bg-[var(--accent-primary)] transition-all duration-300 ${
                  idx < currentSlide ? 'w-full' : (idx === currentSlide ? 'w-full' : 'w-0')
                }`}
              />
            </div>
          ))}
        </div>

        {/* Tap areas for mobile/desktop navigation */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

        {/* Center Content Slide */}
        <div className="my-auto z-20 flex items-center justify-center py-6">
          {slides[currentSlide].render()}
        </div>

        {/* Bottom Bar Controls */}
        <div className="z-20 flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={exportSlide}
            disabled={isExporting}
            className="btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5"
            title="Download Story Card (9:16)"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{isExporting ? "Saving..." : "Save Story"}</span>
          </button>

          <button
            onClick={() => setViewMode('dashboard')}
            className="btn-primary !py-2 !px-5 text-xs font-bold"
          >
            <span>{currentSlide === slides.length - 1 ? "Open Dashboard" : "Skip to Dashboard"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
