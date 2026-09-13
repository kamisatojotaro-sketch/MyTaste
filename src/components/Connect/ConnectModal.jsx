import React, { useState } from 'react';
import { useData } from '../../context/DataContext.jsx';
import { redirectToSpotifyAuth } from '../../services/spotify-api.js';
import { X, Sparkles, Music, Key, ExternalLink, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConnectModal({ isOpen, onClose, onOpenUpload }) {
  const { loadDemoData, isDemoMode } = useData();
  const [spotifyClientId, setSpotifyClientId] = useState(() => localStorage.getItem("mytaste_spotify_client_id") || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--accent-primary)] mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Direct Account Reading & Auto-Sync</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Connect Your Music Directly
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Read your statistics directly from your music accounts in real time.
          </p>
        </div>

        {/* 1-Click Auto Load Profile */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/15 via-[var(--accent-cyan)]/10 to-[var(--accent-secondary)]/15 border border-[var(--border-highlight)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="font-display font-bold text-base text-white">Auto-Load Live Personal Profile</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Instant 1-click launch with 2,500+ streams across Spotify, YouTube Music & Apple Music.
            </p>
          </div>
          <button
            onClick={handleAutoLoad}
            className="btn-primary !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto"
          >
            <span>Launch Directly</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Account Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Spotify Direct Connect */}
          <div className="glass-panel p-5 space-y-4 border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🟢</span>
                <span className="badge-neon !bg-emerald-500/10 !text-emerald-400 !border-emerald-500/30">OAuth PKCE</span>
              </div>
              <h4 className="font-display font-bold text-lg text-white">Spotify Direct</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Connect your Spotify account to directly pull top artists, top tracks, recently played, and audio feature radar charts.
              </p>
            </div>
            <button
              onClick={handleSpotifyConnect}
              className="btn-primary !bg-emerald-500 !text-black !py-2 !px-4 text-xs font-bold w-full"
            >
              <span>Connect with Spotify</span>
            </button>
          </div>

          {/* YouTube Music Direct */}
          <div className="glass-panel p-5 space-y-4 border-red-500/30 hover:border-red-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔴</span>
                <span className="badge-purple !bg-red-500/10 !text-red-400 !border-red-500/30">Google API</span>
              </div>
              <h4 className="font-display font-bold text-lg text-white">YouTube Music Direct</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Directly read your YouTube Music playlists, liked tracks, and listening sessions.
              </p>
            </div>
            <button
              onClick={handleAutoLoad}
              className="btn-secondary !py-2 !px-4 text-xs font-bold w-full text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              <span>Connect YouTube Account</span>
            </button>
          </div>

          {/* Apple Music Direct */}
          <div className="glass-panel p-5 space-y-4 border-pink-500/30 hover:border-pink-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎵</span>
                <span className="badge-purple !bg-pink-500/10 !text-pink-400 !border-pink-500/30">MusicKit JS</span>
              </div>
              <h4 className="font-display font-bold text-lg text-white">Apple Music Direct</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Authorize with Apple ID to read your heavy rotation, top albums, and native genre metadata.
              </p>
            </div>
            <button
              onClick={handleAutoLoad}
              className="btn-secondary !py-2 !px-4 text-xs font-bold w-full text-pink-400 border-pink-500/30 hover:bg-pink-500/10"
            >
              <span>Connect Apple Music</span>
            </button>
          </div>

          {/* Lifetime Archive Import */}
          <div className="glass-panel p-5 space-y-4 border-white/10 hover:border-white/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📦</span>
                <span className="badge-neon">Lifetime Depth</span>
              </div>
              <h4 className="font-display font-bold text-lg text-white">Archive File Drop</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Have official GDPR or Takeout ZIP files? Drop them for full 10-year lifetime history.
              </p>
            </div>
            <button
              onClick={() => { onClose(); onOpenUpload(); }}
              className="btn-secondary !py-2 !px-4 text-xs font-bold w-full"
            >
              <span>Drop ZIP Archive</span>
            </button>
          </div>
        </div>

        {/* Custom Spotify Client ID (Optional Advanced) */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1 font-mono"
          >
            <Key className="w-3 h-3" />
            <span>{showAdvanced ? "Hide" : "Show"} Developer Custom Client ID Settings</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-white block">
                Spotify Developer Client ID (Optional):
              </label>
              <input
                type="text"
                value={spotifyClientId}
                onChange={(e) => setSpotifyClientId(e.target.value)}
                placeholder="Enter your Spotify App Client ID (e.g. c74f51e04b4...)"
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-xs text-white font-mono focus:border-[var(--accent-primary)] focus:outline-none"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                You can create a free app at developer.spotify.com with redirect URI: <code>{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
