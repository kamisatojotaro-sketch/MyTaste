import React from 'react';
import { 
  BarChart3, 
  Film, 
  Share2, 
  Lock, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';

export default function Landing({ onOpenConnect, onOpenUpload }) {
  const dataContext = useData?.() || {};
  const loadDemoData = dataContext.loadDemoData;

  const platforms = [
    {
      title: '🎵 Spotify',
      subtitle: 'Direct OAuth connect or data export',
      borderColor: '#34D399',
      borderClass: 'border-l-emerald-400',
      badge: 'OAuth & GDPR',
    },
    {
      title: '🔴 YouTube Music',
      subtitle: 'Google Takeout integration',
      borderColor: '#EF4444',
      borderClass: 'border-l-red-500',
      badge: 'Takeout JSON',
    },
    {
      title: '▶️ YouTube',
      subtitle: 'Watch history analysis',
      borderColor: '#F43F5E',
      borderClass: 'border-l-rose-500',
      badge: 'Watch History',
    },
    {
      title: '🍎 Apple Music',
      subtitle: 'CSV or JSON export',
      borderColor: '#EC4899',
      borderClass: 'border-l-pink-500',
      badge: 'Privacy Export',
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: '60+ Deep Metrics',
      description: 'Granular stats on circadian listening hours, obsession peaks, skip velocity, and multi-year artist timelines.',
      iconColor: 'text-[var(--accent-primary)]',
      bgGlow: 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20',
    },
    {
      icon: Film,
      title: 'Wrapped-Style Story Mode',
      description: 'Full-screen cinematic visual recap celebrating your unique musical identity and top sonic moments.',
      iconColor: 'text-[var(--accent-cyan)]',
      bgGlow: 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/20',
    },
    {
      icon: Share2,
      title: 'Shareable Social Cards',
      description: 'Export gorgeous 9:16 story cards, personalized festival lineup posters, and checkout receipts for social media.',
      iconColor: 'text-[var(--accent-secondary)]',
      bgGlow: 'bg-[var(--accent-secondary)]/10 border-[var(--accent-secondary)]/20',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 text-center overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[var(--accent-primary)]/15 via-[var(--accent-secondary)]/15 to-transparent rounded-full blur-[110px] pointer-events-none -z-10"
        aria-hidden="true" 
      />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Shimmer Eyebrow Badge */}
        <div 
          className="animate-fadeInUp inline-flex" 
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="badge-shimmer">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
            <span>Multi-Platform Music Intelligence</span>
          </div>
        </div>

        {/* Massive Heading */}
        <h1 
          className="animate-fadeInUp font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.05]"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          <span className="block text-white">Your Music DNA,</span>
          <span className="block text-gradient-primary">Decoded.</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="animate-fadeInUp text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed font-body"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          Privacy-first music intelligence across Spotify, YouTube Music, YouTube & Apple Music. 100% client-side. Zero cloud tracking.
        </p>

        {/* Two Primary CTA Buttons */}
        <div 
          className="animate-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <button
            type="button"
            onClick={onOpenConnect}
            className="btn-primary w-full sm:w-auto text-base !py-3.5 !px-8 cursor-pointer shadow-xl shadow-[var(--accent-primary)]/20"
          >
            <span>⚡ Connect Your Accounts</span>
          </button>

          <button
            type="button"
            onClick={onOpenUpload}
            className="btn-secondary w-full sm:w-auto text-base !py-3.5 !px-8 cursor-pointer"
          >
            <span>📁 Upload Data Archive</span>
          </button>
        </div>

        {/* Optional Demo preview link */}
        {loadDemoData && (
          <div 
            className="animate-fadeInUp pt-1" 
            style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
          >
            <button
              type="button"
              onClick={loadDemoData}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Or explore with simulated interactive data</span>
            </button>
          </div>
        )}
      </div>

      {/* Platform Cards Row (4 cards: 1 col mobile, 2 col tablet, 4 col desktop) */}
      <div 
        className="animate-fadeInUp w-full"
        style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {platforms.map((platform) => (
            <div
              key={platform.title}
              className={`glass-panel p-5 border-l-4 ${platform.borderClass} text-left flex flex-col justify-between space-y-3 transition-all duration-300 hover:translate-y-[-2px] hover:border-white/20`}
              style={{ borderLeftColor: platform.borderColor }}
            >
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  {platform.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed font-body">
                  {platform.subtitle}
                </p>
              </div>
              <div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] border border-white/5">
                  {platform.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Feature Highlights */}
      <div 
        className="animate-fadeInUp w-full"
        style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-panel p-4 flex items-start gap-3.5 text-left transition-all duration-300 hover:border-white/20"
              >
                <div className={`p-2.5 rounded-xl border ${feature.bgGlow} ${feature.iconColor} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Badge at Bottom */}
      <div 
        className="animate-fadeInUp flex items-center justify-center pt-2"
        style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
      >
        <div className="glass-panel !rounded-full px-5 py-2.5 flex items-center gap-2.5 text-xs text-[var(--text-secondary)] border-white/10 shadow-lg">
          <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
          <span className="font-mono">
            All processing happens in your browser. Your data never leaves your device.
          </span>
        </div>
      </div>
    </div>
  );
}
