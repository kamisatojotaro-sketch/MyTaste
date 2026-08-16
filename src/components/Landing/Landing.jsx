import React from 'react';
import { useData } from '../../context/DataContext.jsx';
import { 
  Sparkles, 
  Upload, 
  BarChart3, 
  Lock, 
  Layers, 
  Share2, 
  Flame, 
  PieChart, 
  Calendar, 
  Disc3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Landing({ onOpenUpload, onOpenTutorial }) {
  const { loadDemoData } = useData();

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-[var(--accent-primary)] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
          <span>SPOTIFY • YOUTUBE MUSIC • YOUTUBE • APPLE MUSIC</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Your Entire Music Life. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-cyan)] to-[var(--accent-secondary)]">
            One Unified Portrait.
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
          Unlock 60+ deep statistics, 7x24 circadian heatmaps, multi-year streamgraphs, and Wrapped-style stories. 
          <strong className="text-white font-semibold"> 100% private & client-side</strong> in your browser.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenUpload}
            className="btn-primary w-full sm:w-auto !py-3.5 !px-8 text-base font-bold shadow-xl shadow-[var(--accent-primary)]/25"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Your Music Data</span>
          </button>

          <button
            onClick={loadDemoData}
            className="btn-secondary w-full sm:w-auto !py-3.5 !px-7 text-base font-semibold border-white/20"
          >
            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
            <span>Try Live Interactive Demo</span>
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Only 1 data source required. Zero accounts, zero server storage, zero telemetry.
        </p>
      </div>

      {/* Supported Platforms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12">
        <div className="glass-panel p-5 text-center space-y-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-lg">
            🟢
          </div>
          <h3 className="font-display font-bold text-white text-base">Spotify</h3>
          <p className="text-xs text-[var(--text-secondary)]">Standard JSON & Extended Lifetime GDPR History</p>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono">
            Optional
          </span>
        </div>

        <div className="glass-panel p-5 text-center space-y-2 border-red-500/20 hover:border-red-500/50 transition-all">
          <div className="w-10 h-10 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-lg">
            🔴
          </div>
          <h3 className="font-display font-bold text-white text-base">YouTube Music</h3>
          <p className="text-xs text-[var(--text-secondary)]">Google Takeout watch-history.json & playlists</p>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 font-mono">
            Optional
          </span>
        </div>

        <div className="glass-panel p-5 text-center space-y-2 border-rose-500/20 hover:border-rose-500/50 transition-all">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-lg">
            ▶️
          </div>
          <h3 className="font-display font-bold text-white text-base">YouTube (General)</h3>
          <p className="text-xs text-[var(--text-secondary)]">Music videos, live sessions, covers & official audio</p>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-mono">
            Optional
          </span>
        </div>

        <div className="glass-panel p-5 text-center space-y-2 border-pink-500/20 hover:border-pink-500/50 transition-all">
          <div className="w-10 h-10 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold text-lg">
            🎵
          </div>
          <h3 className="font-display font-bold text-white text-base">Apple Music</h3>
          <p className="text-xs text-[var(--text-secondary)]">Apple Media Services CSV & JSON exports</p>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-mono">
            Optional
          </span>
        </div>
      </div>

      {/* Key Feature Highlights */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">What You'll Discover</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Everything Spotify Wrapped hides + third-party intelligence combined</p>
          </div>
          <button 
            onClick={onOpenTutorial}
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
          >
            How to export your data <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-primary)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">60+ Granular Metrics</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Top 50 artists, top 50 songs, one-hit wonders, skip velocity, obsession peaks, and decade timelines.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-cyan)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">7×24 Heatmaps & Clocks</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Visualizing your circadian routine: morning wake-up tracks, deep work focus hours, and midnight binging.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--accent-secondary)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Story Mode & 9:16 Cards</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Wrapped-style full-screen story reveals + receipt cards, festival lineup posters, and instant social exports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
