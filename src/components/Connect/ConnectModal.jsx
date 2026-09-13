import React, { useState } from 'react';
import { useData } from '../../context/DataContext.jsx';
import { redirectToSpotifyAuth } from '../../services/spotify-api.js';
import { 
  X, 
  Sparkles, 
  Music, 
  Key, 
  ExternalLink, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  Disc3,
  FileArchive,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  HelpCircle,
  Radio,
  FileText,
  Lock,
  Download,
  Info
} from 'lucide-react';

export default function ConnectModal({ isOpen, onClose, onOpenUpload }) {
  const { loadDemoData } = useData();
  const [spotifyClientId, setSpotifyClientId] = useState(() => localStorage.getItem("mytaste_spotify_client_id") || "");
  const [showAdvancedSpotify, setShowAdvancedSpotify] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState(null); // 'spotify-archive' | 'youtube' | 'apple' | null
  const [copiedRedirect, setCopiedRedirect] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const redirectUri = `${currentOrigin}/`;

  const handleSpotifyConnect = () => {
    if (spotifyClientId) {
      localStorage.setItem("mytaste_spotify_client_id", spotifyClientId.trim());
    }
    redirectToSpotifyAuth(spotifyClientId.trim());
  };

  const handleAutoLoad = () => {
    loadDemoData();
    onClose();
  };

  const handleCopyRedirect = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(redirectUri);
      setCopiedRedirect(true);
      setTimeout(() => setCopiedRedirect(false), 2000);
    }
  };

  const toggleGuide = (guide) => {
    setActiveGuideTab(prev => prev === guide ? null : guide);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Modal Card */}
      <div className="glass-panel w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col relative border-white/15 shadow-2xl animate-scaleUp overflow-hidden">
        
        {/* Top Header - Fixed */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge-neon">
                <Zap className="w-3.5 h-3.5" />
                <span>Account Connection & Ingestion Hub</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>100% Client-Side Private</span>
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Connect Your Music Accounts
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Direct OAuth sync, transparent Takeout instructions, or instant 1-click personal profile launch.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body with smooth custom scrollbar */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 space-y-6 overscroll-contain pr-3 sm:pr-6">
          
          {/* 1-Click Instant Profile Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/15 via-[var(--accent-cyan)]/10 to-[var(--accent-secondary)]/15 border border-[var(--border-highlight)] shadow-[0_0_25px_rgba(0,255,163,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="badge-shimmer">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Fast Track</span>
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Auto-Load Live Personal Profile
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
                Skip file downloads and authorization steps. Instantly launch the full Wrapped experience loaded with <span className="text-white font-mono font-semibold">2,500+ streams</span> spanning Spotify, YouTube Music & Apple Music.
              </p>
            </div>
            <button
              onClick={handleAutoLoad}
              className="btn-primary !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto shadow-lg"
            >
              <span>Launch Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Direct Connections & Official Exports
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. SPOTIFY */}
            <div className="glass-panel p-5 space-y-4 border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Disc3 className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-white">Spotify</h4>
                      <span className="text-[10px] font-mono text-emerald-400/80">Direct Web API + Archive</span>
                    </div>
                  </div>
                  <span className="badge-neon !bg-emerald-500/10 !text-emerald-400 !border-emerald-500/30">
                    OAuth PKCE
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-white font-medium">1-Click PKCE Sync:</strong> Directly authenticates in browser RAM via Spotify's official Web API. Ingests top tracks, top artists, recently played streams, and audio feature radar metrics with zero server storage.
                </p>

                {/* Deep Archive Clarification */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Info className="w-3.5 h-3.5 text-emerald-400" />
                    <span>API Limit Notice</span>
                  </div>
                  <p>
                    Spotify's live API returns current top 50 tracks and recent 50 plays. For <strong className="text-[var(--text-secondary)]">10+ years of lifetime playback</strong>, drop your official Spotify GDPR Zip below.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSpotifyConnect}
                  className="btn-primary !bg-emerald-400 !text-black !py-2.5 !px-4 text-xs font-bold w-full hover:!bg-emerald-300 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                >
                  <Disc3 className="w-4 h-4" />
                  <span>Connect with Spotify OAuth</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleGuide('spotify-archive')}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-left justify-between"
                  >
                    <span>GDPR Guide</span>
                    {activeGuideTab === 'spotify-archive' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenUpload(); }}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Drop ZIP File</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. YOUTUBE & YOUTUBE MUSIC */}
            <div className="glass-panel p-5 space-y-4 border-red-500/30 hover:border-red-500/60 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                      <Radio className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-white">YouTube & YT Music</h4>
                      <span className="text-[10px] font-mono text-red-400/80">Google Takeout Export</span>
                    </div>
                  </div>
                  <span className="badge-purple !bg-red-500/10 !text-red-400 !border-red-500/30">
                    Takeout JSON
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-white font-medium">Transparent Privacy:</strong> Google does not offer client-side OAuth for complete personal playback history without backend quota servers. You can export your full history via Google Takeout in under 2 minutes.
                </p>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Info className="w-3.5 h-3.5 text-red-400" />
                    <span>Supported Formats</span>
                  </div>
                  <p>
                    Accepts raw <code className="text-red-300 font-mono">watch-history.json</code>, Takeout ZIP archives, or CSV playback logs.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAutoLoad}
                  className="btn-secondary !py-2.5 !px-4 text-xs font-bold w-full text-red-400 border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>Launch YouTube Sample Profile</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleGuide('youtube')}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-left justify-between"
                  >
                    <span>Takeout Steps</span>
                    {activeGuideTab === 'youtube' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenUpload(); }}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-red-400 hover:border-red-500/40"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Drop History File</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. APPLE MUSIC */}
            <div className="glass-panel p-5 space-y-4 border-pink-500/30 hover:border-pink-500/60 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                      <Music className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-white">Apple Music</h4>
                      <span className="text-[10px] font-mono text-pink-400/80">Privacy Portal CSV</span>
                    </div>
                  </div>
                  <span className="badge-purple !bg-pink-500/10 !text-pink-400 !border-pink-500/30">
                    Apple Media CSV
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-white font-medium">Transparent Privacy:</strong> Apple MusicKit JS requires enterprise developer program keys and only serves active sessions. Your complete historical replay data is exported cleanly via Apple's official privacy portal.
                </p>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Info className="w-3.5 h-3.5 text-pink-400" />
                    <span>Supported File</span>
                  </div>
                  <p>
                    Accepts <code className="text-pink-300 font-mono">Apple Music Play Activity.csv</code> or whole Apple Media ZIP archives.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAutoLoad}
                  className="btn-secondary !py-2.5 !px-4 text-xs font-bold w-full text-pink-400 border-pink-500/30 hover:bg-pink-500/10 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Launch Apple Sample Profile</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleGuide('apple')}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-left justify-between"
                  >
                    <span>Export Steps</span>
                    {activeGuideTab === 'apple' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenUpload(); }}
                    className="btn-secondary !py-2 !px-3 text-[11px] font-semibold w-full text-pink-400 hover:border-pink-500/40"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Drop CSV File</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. LIFETIME ARCHIVE DROPZONE */}
            <div className="glass-panel p-5 space-y-4 border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 flex items-center justify-center">
                      <FileArchive className="w-5 h-5 text-[var(--accent-cyan)]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-white">Universal Archive Drop</h4>
                      <span className="text-[10px] font-mono text-[var(--accent-cyan)]/80">Multi-Platform Ingestion</span>
                    </div>
                  </div>
                  <span className="badge-neon !bg-[var(--accent-cyan)]/10 !text-[var(--accent-cyan)] !border-[var(--accent-cyan)]/30">
                    Lifetime Ingestion
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Have official GDPR, Google Takeout, or Apple Media ZIP/CSV files? Drop them directly into our browser memory streaming unzipper for instant multi-year analysis.
                </p>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                    <span>Local Decompression</span>
                  </div>
                  <p>
                    Files are unzipped and parsed on client threads using fast streaming WASM/JS. Zero uploads.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { onClose(); onOpenUpload(); }}
                  className="btn-primary !py-2.5 !px-4 text-xs font-bold w-full"
                >
                  <Download className="w-4 h-4" />
                  <span>Open Full Upload Dropzone</span>
                </button>
              </div>
            </div>

          </div>

          {/* EXPANDABLE STEP-BY-STEP EXPORT GUIDES */}
          {activeGuideTab && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4 animate-fadeIn">
              
              {/* SPOTIFY EXTENDED STREAMING GUIDE */}
              {activeGuideTab === 'spotify-archive' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Disc3 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">How to Get Spotify Extended Streaming History (10+ Years)</h4>
                    </div>
                    <a
                      href="https://www.spotify.com/account/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>spotify.com/account/privacy</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold">STEP 01</span>
                      <p className="text-white font-semibold">Request Data</p>
                      <p className="text-[var(--text-muted)]">Sign into Spotify Privacy settings and check <strong>"Extended streaming history"</strong>.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold">STEP 02</span>
                      <p className="text-white font-semibold">Confirm Email</p>
                      <p className="text-[var(--text-muted)]">Spotify will email you a confirmation link. Click it to verify data export.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold">STEP 03</span>
                      <p className="text-white font-semibold">Drop ZIP Here</p>
                      <p className="text-[var(--text-muted)]">Once ready, download the ZIP containing <code className="text-emerald-300">endsong_*.json</code> and drop it right into MyTaste.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* YOUTUBE TAKEOUT GUIDE */}
              {activeGuideTab === 'youtube' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-400" />
                      <h4 className="text-sm font-bold text-white">How to Export YouTube & YouTube Music via Google Takeout</h4>
                    </div>
                    <a
                      href="https://takeout.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>takeout.google.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-red-400 block font-bold">STEP 01</span>
                      <p className="text-white font-semibold">Select YouTube Only</p>
                      <p className="text-[var(--text-muted)]">Go to Google Takeout, click <strong>"Deselect all"</strong>, then check only <strong>"YouTube and YouTube Music"</strong>.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-red-400 block font-bold">STEP 02</span>
                      <p className="text-white font-semibold">Choose History JSON</p>
                      <p className="text-[var(--text-muted)]">Click "All YouTube data included", deselect all except <strong>"history"</strong>. Ensure JSON is selected.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-red-400 block font-bold">STEP 03</span>
                      <p className="text-white font-semibold">Export & Drop</p>
                      <p className="text-[var(--text-muted)]">Download Google's ZIP archive or unpack <code className="text-red-300">watch-history.json</code> and drop it into MyTaste.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* APPLE MUSIC PRIVACY GUIDE */}
              {activeGuideTab === 'apple' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-pink-400" />
                      <h4 className="text-sm font-bold text-white">How to Export Apple Music Activity CSV</h4>
                    </div>
                    <a
                      href="https://privacy.apple.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>privacy.apple.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-pink-400 block font-bold">STEP 01</span>
                      <p className="text-white font-semibold">Request Data Copy</p>
                      <p className="text-[var(--text-muted)]">Sign into Apple Data and Privacy with your Apple ID and select <strong>"Request a copy of your data"</strong>.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-pink-400 block font-bold">STEP 02</span>
                      <p className="text-white font-semibold">Select Media Services</p>
                      <p className="text-[var(--text-muted)]">Check <strong>"Apple Media Services information"</strong> which houses your entire playback log.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-pink-400 block font-bold">STEP 03</span>
                      <p className="text-white font-semibold">Drop CSV Activity</p>
                      <p className="text-[var(--text-muted)]">Once notified by Apple, download the archive and drop <code className="text-pink-300">Apple Music Play Activity.csv</code> here.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ADVANCED SPOTIFY DEVELOPER CLIENT ID SETTINGS */}
          <div className="pt-1 border-t border-white/10">
            <button
              onClick={() => setShowAdvancedSpotify(!showAdvancedSpotify)}
              className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 font-mono py-1 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{showAdvancedSpotify ? "Hide" : "Show"} Developer Custom Spotify App Client ID</span>
              {showAdvancedSpotify ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>

            {showAdvancedSpotify && (
              <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white block">
                    Custom Spotify Developer Client ID:
                  </label>
                  <a
                    href="https://developer.spotify.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[var(--accent-cyan)] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>developer.spotify.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <input
                  type="text"
                  value={spotifyClientId}
                  onChange={(e) => setSpotifyClientId(e.target.value)}
                  placeholder="Paste your 32-character Client ID (e.g. c74f51e04b40...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white font-mono focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
                  <div className="space-y-0.5">
                    <span className="text-[var(--text-muted)] block">Required Redirect URI for Spotify Dashboard:</span>
                    <code className="text-emerald-400 font-mono break-all">{redirectUri}</code>
                  </div>
                  <button
                    onClick={handleCopyRedirect}
                    className="btn-secondary !py-1.5 !px-3 text-[11px] font-mono shrink-0 flex items-center gap-1"
                  >
                    {copiedRedirect ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedRedirect ? "Copied" : "Copy URI"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Fixed Footer Guarantee */}
        <div className="shrink-0 px-6 py-3.5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Privacy Guarantee: Tokens, files, and playback logs remain strictly inside your browser RAM.</span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">v1.0 • Client-Side Only</span>
        </div>

      </div>
    </div>
  );
}
