import React from 'react';
import { Sparkles, Disc, Music, ExternalLink, Flame } from 'lucide-react';

const CURATED_RECOMMENDATIONS = {
  "Pop": [
    { type: "Album", title: "Short n\' Sweet", artist: "Sabrina Carpenter", reason: "Matches your energetic pop rotations", vibe: "Sassy & Catchy", year: "2024" },
    { type: "Song", title: "Good Luck, Babe!", artist: "Chappell Roan", reason: "Viral synth-pop anthem resonating with your listening curve", vibe: "80s Synth Pop", year: "2024" },
    { type: "Album", title: "BRAT", artist: "Charli xcx", reason: "High-octane club pop matching peak tempo tracks", vibe: "Hyperpop / Club", year: "2024" }
  ],
  "Hip-Hop / Rap": [
    { type: "Album", title: "GNX", artist: "Kendrick Lamar", reason: "Deep West Coast lyricism aligned with your top hip-hop plays", vibe: "West Coast Hip-Hop", year: "2024" },
    { type: "Song", title: "Like That", artist: "Future, Metro Boomin, Kendrick Lamar", reason: "Hard-hitting 808s and chart dominance", vibe: "Trap Anthem", year: "2024" },
    { type: "Album", title: "CHROMATKOPIA", artist: "Tyler, The Creator", reason: "Experimental production matching your genre diversity", vibe: "Alternative Hip-Hop", year: "2024" }
  ],
  "Indie & Alternative": [
    { type: "Album", title: "The Record", artist: "boygenius", reason: "Harmonic storytelling for introspective listening hours", vibe: "Indie Folk / Rock", year: "2023" },
    { type: "Song", title: "Stick Season", artist: "Noah Kahan", reason: "Acoustic momentum matching late-night sessions", vibe: "Folk Pop", year: "2022" },
    { type: "Album", title: "The Land Is Inhospitable and So Are We", artist: "Mitski", reason: "Cinematic indie resonance", vibe: "Orchestral Indie", year: "2023" }
  ],
  "Rock & Metal": [
    { type: "Album", title: "Take Me Back To Eden", artist: "Sleep Token", reason: "Atmospheric genre-blending heavy soundscape", vibe: "Progressive Metal", year: "2023" },
    { type: "Song", title: "Kool-Aid", artist: "Bring Me The Horizon", reason: "High energy riff matching peak intensity hours", vibe: "Alternative Metal", year: "2024" },
    { type: "Album", title: "But Here We Are", artist: "Foo Fighters", reason: "Emotional rock anthem with classic resonance", vibe: "Alternative Rock", year: "2023" }
  ],
  "Electronic & Dance": [
    { type: "Album", title: "USB", artist: "Fred again..", reason: "Club anthems tailored to your high-tempo listening matrix", vibe: "UK Garage / Electronic", year: "2024" },
    { type: "Song", title: "adore u", artist: "Fred again.. & Obongjayar", reason: "Euphoric emotional electronic track", vibe: "Dance / House", year: "2023" },
    { type: "Album", title: "Quest For Fire", artist: "Skrillex", reason: "Genre-defining bass & electronic versatility", vibe: "Bass / Electronic", year: "2023" }
  ],
  "R&B & Soul": [
    { type: "Album", title: "SOS", artist: "SZA", reason: "Vocal vulnerability matching emotional listening peaks", vibe: "Contemporary R&B", year: "2022" },
    { type: "Song", title: "Snooze", artist: "SZA", reason: "Smooth melodies aligned with evening rotation", vibe: "R&B", year: "2022" },
    { type: "Album", title: "Beloved! Paradise! Jazz!?", artist: "McKinley Dixon", reason: "Jazz-infused soul masterpiece", vibe: "Jazz Rap / Soul", year: "2023" }
  ],
  "Other": [
    { type: "Album", title: "HIT ME HARD AND SOFT", artist: "Billie Eilish", reason: "Dynamic sonic spectrum tailored to your overall taste", vibe: "Alternative Pop", year: "2024" },
    { type: "Song", title: "Too Sweet", artist: "Hozier", reason: "Blues-tinged indie rock anthem", vibe: "Indie Rock", year: "2024" },
    { type: "Album", title: "TANGK", artist: "IDLES", reason: "Post-punk rhythm to expand your catalog depth", vibe: "Post-Punk", year: "2024" }
  ]
};

export default function RecommendationsSection({ stats }) {
  if (!stats) return null;

  const topGenre = stats.funStats.topGenre || "Pop";
  const recs = CURATED_RECOMMENDATIONS[topGenre] || CURATED_RECOMMENDATIONS["Other"];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase tracking-wider font-semibold">
            Section 10 // AI Sonic Engine
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Personalized Music & Album Recommendations
          </h2>
        </div>
        <span className="badge-neon">
          Tailored to {topGenre}
        </span>
      </div>

      <div className="dashboard-grid">
        {recs.map((rec, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4 hover:border-[var(--border-highlight)] transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-cyan)] flex items-center justify-center text-black font-extrabold shadow-lg shadow-[var(--accent-primary)]/20">
                {rec.type === 'Album' ? <Disc className="w-6 h-6" /> : <Music className="w-6 h-6" />}
              </div>
              <span className="badge-purple !text-[10px]">
                {rec.type} • {rec.year}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[var(--accent-cyan)] uppercase font-semibold">
                {rec.vibe}
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                {rec.title}
              </h3>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">
                {rec.artist}
              </p>
              <p className="text-xs text-[var(--text-muted)] pt-2 leading-relaxed">
                💡 {rec.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${rec.title} ${rec.artist}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-[var(--accent-primary)] hover:border-[var(--accent-primary)]"
              >
                <span>Listen Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Match Score: 98%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
