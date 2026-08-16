import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Download, 
  Layers, 
  Share2, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function TutorialModal({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to MyTaste",
      subtitle: "The all-in-one music intelligence dashboard",
      icon: <Sparkles className="w-8 h-8 text-[var(--accent-primary)]" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)]">
          <p>
            MyTaste combines your listening history across <strong className="text-white">Spotify</strong>, <strong className="text-white">YouTube Music</strong>, <strong className="text-white">YouTube</strong>, and <strong className="text-white">Apple Music</strong> into a single, unified analytical dashboard.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">What you get:</h5>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>60+ deep statistics (skip velocity, obsession streaks, decade shifts)</li>
              <li>7x24 circadian heatmaps & 365-day listening calendar</li>
              <li>Wrapped-style Story Mode with animated reveals</li>
              <li>Instagram & TikTok 9:16 shareable cards</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "100% Client-Side & Private",
      subtitle: "Your data never leaves your device",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)]">
          <p>
            Unlike other music tools, MyTaste processes all JSON, CSV, and HTML archives <strong className="text-white">entirely in your browser memory</strong> using Web Workers.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-emerald-400 font-bold block text-sm">🔒 Zero Servers</span>
              <p className="text-[11px] text-[var(--text-muted)]">No server uploads or database storage</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-emerald-400 font-bold block text-sm">🚫 Zero Accounts</span>
              <p className="text-[11px] text-[var(--text-muted)]">No logins or third-party tracking</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            You can disconnect from the internet after loading the page and the dashboard will continue working seamlessly.
          </p>
        </div>
      )
    },
    {
      title: "How to Export Your Music Data",
      subtitle: "Download official files from your platforms",
      icon: <Download className="w-8 h-8 text-[var(--accent-cyan)]" />,
      content: (
        <div className="space-y-3 text-xs text-[var(--text-secondary)] max-h-60 overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">🟢 Spotify Extended History (Recommended)</span>
              <a 
                href="https://www.spotify.com/account/privacy/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
              >
                spotify.com/privacy <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[11px]">Go to Privacy Settings → Request <strong>Extended streaming history</strong> (or standard Account Data). Drop the delivered .zip file here.</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">🔴 YouTube / YouTube Music</span>
              <a 
                href="https://takeout.google.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
              >
                takeout.google.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[11px]">Deselect all → Select only <strong>YouTube and YouTube Music</strong> → Export. Upload the .zip or <code>watch-history.json</code>.</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">🎵 Apple Music</span>
              <a 
                href="https://privacy.apple.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
              >
                privacy.apple.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[11px]">Request copy of data → <strong>Apple Media Services</strong> → Upload the CSV/JSON play history.</p>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Features & Sharing",
      subtitle: "Filter, explore, and share your story",
      icon: <Share2 className="w-8 h-8 text-[var(--accent-secondary)]" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)]">
          <p>
            Once loaded, click <strong className="text-white">Story Mode</strong> to experience a full Spotify Wrapped-style cinematic reveal.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm">📱</span>
              <span className="text-xs text-white font-medium">Export high-res 9:16 vertical story cards for Instagram & TikTok</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm">🎛️</span>
              <span className="text-xs text-white font-medium">Filter by specific platform, date ranges, and custom play thresholds</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm">🎨</span>
              <span className="text-xs text-white font-medium">Switch seamlessly between Electric Cyber and Obsidian Glass themes</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('mytaste_tutorial_completed', 'true');
      onClose();
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-[var(--accent-primary)]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Current Step Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            {steps[currentStep].icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              {steps[currentStep].title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div>
          {steps[currentStep].content}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn-secondary !py-2 !px-4 text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="btn-primary !py-2 !px-6 text-xs flex items-center gap-1 font-bold"
          >
            <span>{currentStep === steps.length - 1 ? "Got it! Let's Go" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
