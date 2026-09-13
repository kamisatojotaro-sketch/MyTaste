import React, { useState, useMemo } from 'react';
import { Disc3, Music, ExternalLink, RefreshCw, Sparkles, Zap, Radio, Compass } from 'lucide-react';

/**
 * Curated catalogs for macro genres.
 * Each genre features an expanded set of 6 recommendations (Albums & Songs)
 * with distinct reason badges: "Vibe match", "Acoustic cousin", "Deep cut discovery".
 */
const GENRE_RECOMMENDATIONS = {
  "Pop": {
    gradient: "from-[#FF007A] via-[#00FFA3] to-[#00F5D4]",
    primaryColor: "#00FFA3",
    items: [
      {
        type: "Album",
        title: "Short n' Sweet",
        artist: "Sabrina Carpenter",
        year: "2024",
        vibe: "Sassy & Hook-Heavy",
        reason: "Vibe match",
        description: "Brisk, witty earworms echoing your pop-heavy listening velocity and uptempo rotation."
      },
      {
        type: "Song",
        title: "Good Luck, Babe!",
        artist: "Chappell Roan",
        year: "2024",
        vibe: "80s Synth Pop",
        reason: "Acoustic cousin",
        description: "Grand theatrical synth build aligning with soaring vocal climaxes found in your top plays."
      },
      {
        type: "Album",
        title: "BRAT",
        artist: "Charli xcx",
        year: "2024",
        vibe: "Club Pop / Hyperpop",
        reason: "Deep cut discovery",
        description: "High-octane electronic club pop engineered to stretch your catalog into forward-leaning sounds."
      },
      {
        type: "Song",
        title: "Espresso",
        artist: "Sabrina Carpenter",
        year: "2024",
        vibe: "Nu-Disco Funk",
        reason: "Vibe match",
        description: "Breezy retro-pop groove calibrated to your daytime uptempo streaming sessions."
      },
      {
        type: "Album",
        title: "Radical Optimism",
        artist: "Dua Lipa",
        year: "2024",
        vibe: "Neo-Psychedelic Pop",
        reason: "Acoustic cousin",
        description: "Lush French touch basslines paired with shimmering radio-ready pop choruses."
      },
      {
        type: "Song",
        title: "Birds of a Feather",
        artist: "Billie Eilish",
        year: "2024",
        vibe: "Shimmering Alt-Pop",
        reason: "Deep cut discovery",
        description: "Delicate multi-layered vocals with organic rhythms expanding your melodic spectrum."
      }
    ]
  },
  "Indie": {
    gradient: "from-[#00F5D4] via-[#CCFF00] to-[#38BDF8]",
    primaryColor: "#00F5D4",
    items: [
      {
        type: "Album",
        title: "The Record",
        artist: "boygenius",
        year: "2023",
        vibe: "Indie Folk / Rock",
        reason: "Vibe match",
        description: "Harmonic storytelling and emotional resonance tailored to introspective late-night listening."
      },
      {
        type: "Song",
        title: "Stick Season",
        artist: "Noah Kahan",
        year: "2022",
        vibe: "Folk Pop / Acoustic",
        reason: "Acoustic cousin",
        description: "Driving acoustic momentum matching your reflective acoustic listening spikes."
      },
      {
        type: "Album",
        title: "The Land Is Inhospitable",
        artist: "Mitski",
        year: "2023",
        vibe: "Orchestral Indie",
        reason: "Deep cut discovery",
        description: "Cinematic pedal steel arrangements reflecting your deep-cut appreciation."
      },
      {
        type: "Song",
        title: "Too Sweet",
        artist: "Hozier",
        year: "2024",
        vibe: "Blues Rock / Alt",
        reason: "Vibe match",
        description: "Gravelly hooks and punchy basslines mirroring your top alternative track rotation."
      },
      {
        type: "Album",
        title: "Prelude to Ecstasy",
        artist: "The Last Dinner Party",
        year: "2024",
        vibe: "Baroque Glam Rock",
        reason: "Acoustic cousin",
        description: "Ornate melodic drama with rich guitar flourishes for indie-rock enthusiasts."
      },
      {
        type: "Song",
        title: "Not Strong Enough",
        artist: "boygenius",
        year: "2023",
        vibe: "Jangle Indie Rock",
        reason: "Deep cut discovery",
        description: "Propulsive guitars paired with anthemic vocal delivery for daytime focus streams."
      }
    ]
  },
  "Hip-Hop": {
    gradient: "from-[#8A2BE2] via-[#FF007A] to-[#FF5500]",
    primaryColor: "#8A2BE2",
    items: [
      {
        type: "Album",
        title: "GNX",
        artist: "Kendrick Lamar",
        year: "2024",
        vibe: "West Coast Hip-Hop",
        reason: "Vibe match",
        description: "Crisp production, hard knocks, and West Coast storytelling matching your top rap rotations."
      },
      {
        type: "Song",
        title: "Like That",
        artist: "Future, Metro Boomin, Kendrick Lamar",
        year: "2024",
        vibe: "Trap Anthem",
        reason: "Acoustic cousin",
        description: "Explosive 808s and aggressive cadence aligned with high-tempo active listening."
      },
      {
        type: "Album",
        title: "CHROMAKOPIA",
        artist: "Tyler, The Creator",
        year: "2024",
        vibe: "Experimental Rap",
        reason: "Deep cut discovery",
        description: "Bold theatrical arrangements pushing hip-hop boundaries for eclectic listeners."
      },
      {
        type: "Song",
        title: "Not Like Us",
        artist: "Kendrick Lamar",
        year: "2024",
        vibe: "Mustard Bounce / Rap",
        reason: "Vibe match",
        description: "Hypnotic rhythm with razor-sharp cadence matching your repeat-heavy stream patterns."
      },
      {
        type: "Album",
        title: "We Don't Trust You",
        artist: "Future & Metro Boomin",
        year: "2024",
        vibe: "Cinematic Trap",
        reason: "Acoustic cousin",
        description: "Dark, menacing production matching your evening hip-hop listening spikes."
      },
      {
        type: "Song",
        title: "Carnival",
        artist: "¥$, Kanye West, Ty Dolla $ign",
        year: "2024",
        vibe: "Arena Choral Rap",
        reason: "Deep cut discovery",
        description: "Thunderous stadium choir percussion paired with distorted low-end frequencies."
      }
    ]
  },
  "Rock": {
    gradient: "from-[#FF0055] via-[#FF5500] to-[#CCFF00]",
    primaryColor: "#FF5500",
    items: [
      {
        type: "Album",
        title: "Take Me Back To Eden",
        artist: "Sleep Token",
        year: "2023",
        vibe: "Progressive Metal",
        reason: "Vibe match",
        description: "Genre-defying blend of heavy breakdowns, ambient soul, and ethereal dynamic shifts."
      },
      {
        type: "Song",
        title: "Kool-Aid",
        artist: "Bring Me The Horizon",
        year: "2024",
        vibe: "Alternative Metal",
        reason: "Acoustic cousin",
        description: "Aggressive guitar drive and soaring vocal hooks calibrated for high intensity."
      },
      {
        type: "Album",
        title: "POST HUMAN: NeX GEn",
        artist: "Bring Me The Horizon",
        year: "2024",
        vibe: "Cyberpunk Rock",
        reason: "Deep cut discovery",
        description: "Hyper-energetic fusion of post-hardcore and electronic glitchcore."
      },
      {
        type: "Song",
        title: "Chokehold",
        artist: "Sleep Token",
        year: "2023",
        vibe: "Atmospheric Heavy",
        reason: "Vibe match",
        description: "Slow-burning dynamic shifts tailored to your high-engagement rock listening."
      },
      {
        type: "Album",
        title: "But Here We Are",
        artist: "Foo Fighters",
        year: "2023",
        vibe: "Melodic Arena Rock",
        reason: "Acoustic cousin",
        description: "Cathartic emotional rock anthems with signature driving percussion velocity."
      },
      {
        type: "Song",
        title: "Drown",
        artist: "Bring Me The Horizon",
        year: "2024",
        vibe: "Emocore Rock",
        reason: "Deep cut discovery",
        description: "Stirring stadium-scale chorus matching your emotional rock palette."
      }
    ]
  },
  "Electronic": {
    gradient: "from-[#00FFA3] via-[#00F5D4] to-[#8A2BE2]",
    primaryColor: "#00FFA3",
    items: [
      {
        type: "Album",
        title: "USB",
        artist: "Fred again..",
        year: "2024",
        vibe: "UK Garage / Club",
        reason: "Vibe match",
        description: "Intimate vocal cuts over propulsive club rhythms matching your weekend tempo."
      },
      {
        type: "Song",
        title: "adore u",
        artist: "Fred again.. & Obongjayar",
        year: "2023",
        vibe: "Euphoric House",
        reason: "Acoustic cousin",
        description: "Uplifting vocal chops and warm synths tailored to your upbeat streaming hours."
      },
      {
        type: "Album",
        title: "Quest For Fire",
        artist: "Skrillex",
        year: "2023",
        vibe: "Bass Music / Club",
        reason: "Deep cut discovery",
        description: "Surgical bass design and global rhythms expanding electronic catalog depth."
      },
      {
        type: "Song",
        title: "places to be",
        artist: "Fred again.. & Anderson .Paak",
        year: "2024",
        vibe: "Liquid DnB",
        reason: "Vibe match",
        description: "Fast-paced breakbeats and sunny soul vocals matching peak active listening times."
      },
      {
        type: "Album",
        title: "Timeless",
        artist: "Kaytranada",
        year: "2024",
        vibe: "Soulful House / Funk",
        reason: "Acoustic cousin",
        description: "Silky 4-on-the-floor house grooves layered with deep neo-soul basslines."
      },
      {
        type: "Song",
        title: "Rumble",
        artist: "Skrillex, Fred again.., Flowdan",
        year: "2023",
        vibe: "Grime / Dubstep",
        reason: "Deep cut discovery",
        description: "Sub-bass powerhouse setting modern electronic festival benchmarks."
      }
    ]
  },
  "R&B": {
    gradient: "from-[#9D4EDD] via-[#FF007A] to-[#00F5D4]",
    primaryColor: "#9D4EDD",
    items: [
      {
        type: "Album",
        title: "SOS",
        artist: "SZA",
        year: "2022",
        vibe: "Contemporary R&B",
        reason: "Vibe match",
        description: "Vocal vulnerability and seamless genre hops aligned with your mood curves."
      },
      {
        type: "Song",
        title: "Snooze",
        artist: "SZA",
        year: "2022",
        vibe: "Slow Jam / R&B",
        reason: "Acoustic cousin",
        description: "Warm mid-tempo production matching late evening and twilight listening."
      },
      {
        type: "Album",
        title: "Beloved! Paradise! Jazz!?",
        artist: "McKinley Dixon",
        year: "2023",
        vibe: "Jazz Rap / Soul",
        reason: "Deep cut discovery",
        description: "Lush live brass and poetic warmth matching your high-appreciation tracks."
      },
      {
        type: "Song",
        title: "Kill Bill",
        artist: "SZA",
        year: "2022",
        vibe: "Alt R&B Groove",
        reason: "Vibe match",
        description: "Irresistible melody and candid lyrical flow matching top stream trends."
      },
      {
        type: "Album",
        title: "Chilombo",
        artist: "Jhené Aiko",
        year: "2020",
        vibe: "Ambient Soul",
        reason: "Acoustic cousin",
        description: "Sound-bowl frequencies and tranquil vocal layers for ambient decompression."
      },
      {
        type: "Song",
        title: "What You Need",
        artist: "Don Toliver",
        year: "2021",
        vibe: "Psychedelic R&B",
        reason: "Deep cut discovery",
        description: "Melodic vocal delivery layered over hypnotic atmospheric synths."
      }
    ]
  }
};

const AVAILABLE_GENRES = Object.keys(GENRE_RECOMMENDATIONS);

/**
 * Normalizes any detected raw genre string to our curated macro genres.
 */
function resolveTopGenre(stats) {
  if (!stats) return "Pop";

  const rawTop = stats.funStats?.topGenre ||
    (stats.genres && stats.genres[0]?.genre) ||
    (stats.genreBreakdown && (stats.genreBreakdown[0]?.name || stats.genreBreakdown[0]?.genre)) ||
    "Pop";

  const lower = String(rawTop).toLowerCase();

  if (lower.includes("hip-hop") || lower.includes("rap") || lower.includes("trap") || lower.includes("drill")) {
    return "Hip-Hop";
  }
  if (lower.includes("indie") || lower.includes("alt") || lower.includes("folk") || lower.includes("shoegaze")) {
    return "Indie";
  }
  if (lower.includes("rock") || lower.includes("metal") || lower.includes("punk") || lower.includes("grunge")) {
    return "Rock";
  }
  if (lower.includes("electron") || lower.includes("dance") || lower.includes("house") || lower.includes("edm") || lower.includes("techno") || lower.includes("bass")) {
    return "Electronic";
  }
  if (lower.includes("r&b") || lower.includes("soul") || lower.includes("funk")) {
    return "R&B";
  }
  return "Pop";
}

/**
 * Computes dynamic match score based on user's affinity data.
 * Produces authentic scores (e.g. 96%, 94%, 91%) tied to genre stream volume and card position.
 */
function calculateAffinityScore(stats, activeGenre, item, itemIndex) {
  const totalStreams = stats?.totalStreams || 100;
  const rawGenres = stats?.genres || stats?.genreBreakdown || [];

  let matchingCount = 0;
  for (const g of rawGenres) {
    const name = (g.genre || g.name || "").toLowerCase();
    const target = activeGenre.toLowerCase();
    if (name.includes(target) || target.includes(name)) {
      matchingCount += (g.count ?? g.value ?? 0);
    }
  }

  if (matchingCount === 0 && rawGenres.length > 0) {
    matchingCount = rawGenres[0].count ?? rawGenres[0].value ?? Math.round(totalStreams * 0.35);
  }

  // Genre ratio typically between 0.15 and 0.65
  const ratio = Math.min(0.65, Math.max(0.15, matchingCount / Math.max(1, totalStreams)));

  // Base affinity between 91 and 96
  const baseAffinity = 90 + Math.round(ratio * 9);

  // Position offset (first item highest, second slightly lower, third lower)
  const positionOffset = itemIndex === 0 ? 0 : itemIndex === 1 ? -2 : -5;

  // Title-based micro variance (0 to 2)
  const titleSum = (item.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const microVariance = titleSum % 3;

  return Math.min(98, Math.max(88, baseAffinity + positionOffset + microVariance));
}

/**
 * Renders Obsidian Aurora reason badges
 */
function ReasonBadge({ reason }) {
  if (reason === 'Vibe match') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[rgba(0,255,163,0.12)] text-[var(--accent-primary)] border border-[rgba(0,255,163,0.3)] shadow-[0_0_8px_rgba(0,255,163,0.15)] whitespace-nowrap">
        <Zap className="w-3 h-3 text-[var(--accent-primary)]" />
        Vibe match
      </span>
    );
  }
  if (reason === 'Acoustic cousin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[rgba(138,43,226,0.15)] text-[#C084FC] border border-[rgba(138,43,226,0.3)] shadow-[0_0_8px_rgba(138,43,226,0.15)] whitespace-nowrap">
        <Radio className="w-3 h-3 text-[#C084FC]" />
        Acoustic cousin
      </span>
    );
  }
  // Deep cut discovery
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[rgba(255,85,0,0.12)] text-[#FF9E40] border border-[rgba(255,85,0,0.3)] shadow-[0_0_8px_rgba(255,85,0,0.15)] whitespace-nowrap">
      <Compass className="w-3 h-3 text-[#FF9E40]" />
      Deep cut discovery
    </span>
  );
}

export default function RecommendationsSection({ stats }) {
  if (!stats) return null;

  const targetGenre = useMemo(() => resolveTopGenre(stats), [stats]);
  const [selectedGenre, setSelectedGenre] = useState(targetGenre);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);

  // Sync if target genre changes externally
  React.useEffect(() => {
    setSelectedGenre(targetGenre);
    setCycleIndex(0);
  }, [targetGenre]);

  const activeGenre = selectedGenre || targetGenre;
  const genreData = GENRE_RECOMMENDATIONS[activeGenre] || GENRE_RECOMMENDATIONS["Pop"];
  const allItems = genreData.items;

  // Each page shows 3 curated recommendations
  const pageSize = 3;
  const totalSets = Math.ceil(allItems.length / pageSize);

  const displayedRecs = useMemo(() => {
    const startIndex = (cycleIndex % totalSets) * pageSize;
    return allItems.slice(startIndex, startIndex + pageSize);
  }, [allItems, cycleIndex, totalSets]);

  const handleCycle = () => {
    setIsCycling(true);
    setCycleIndex(prev => (prev + 1) % totalSets);
    setTimeout(() => setIsCycling(false), 500);
  };

  return (
    <section className="space-y-6">
      {/* 1. Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="section-label">Section 10 // AI Discovery</span>
          <h2 className="section-title mt-1">Curated Sound Expansion</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-body mt-1">
            Algorithmic expansion engine generating next-step sonic exploration calibrated to your taste.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Top Genre Indicator Pill */}
          <span className="badge-neon flex items-center gap-2 !py-1.5 !px-3.5">
            <div className="equalizer-container !h-3">
              <div className="equalizer-bar !w-[2px]" />
              <div className="equalizer-bar !w-[2px]" />
              <div className="equalizer-bar !w-[2px]" />
            </div>
            <span>Target Genre: {targetGenre}</span>
          </span>

          {/* Cycle / Refresh Discovery Button */}
          <button
            onClick={handleCycle}
            className="btn-secondary !py-2 !px-3.5 text-xs font-display flex items-center gap-2 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all cursor-pointer group"
            title="Cycle through discovery sets"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[var(--accent-primary)] transition-transform duration-500 ${
                isCycling ? 'rotate-180' : 'group-hover:rotate-45'
              }`}
            />
            <span>Cycle / Refresh Discovery</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] bg-white/5 px-1.5 py-0.5 rounded">
              Set {cycleIndex + 1}/{totalSets}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Quick Genre Exploration Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap mr-1">
          Explore Genre:
        </span>
        {AVAILABLE_GENRES.map(genre => {
          const isSelected = activeGenre === genre;
          const isTarget = genre === targetGenre;
          return (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setCycleIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[var(--accent-primary)] text-black font-bold shadow-[0_0_15px_rgba(0,255,163,0.35)]'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)] border border-[var(--border-color)]'
              }`}
            >
              <span>{genre}</span>
              {isTarget && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                  }`}
                >
                  TOP
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Responsive 3-Column Grid of Recommendations */}
      <div className="dashboard-grid">
        {displayedRecs.map((rec, idx) => {
          const matchScore = calculateAffinityScore(stats, activeGenre, rec, idx);

          return (
            <div
              key={`${rec.title}-${rec.artist}-${idx}`}
              className="glass-panel glass-panel-interactive p-6 col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              {/* Vibrant Genre Gradient Top Border Highlight */}
              <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${genreData.gradient}`} />

              {/* Ambient Background Corner Glow */}
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-15 blur-2xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
                style={{ background: genreData.primaryColor }}
              />

              {/* Card Top: Icon & Reason Badge */}
              <div className="flex items-start justify-between gap-3 z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-extrabold shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${genreData.primaryColor}, var(--accent-cyan))`
                    }}
                  >
                    {rec.type === 'Album' ? (
                      <Disc3 className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
                    ) : (
                      <Music className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="badge-purple !text-[10px] !py-0.5 !px-2">
                      {rec.type} • {rec.year}
                    </span>
                    <div className="text-[11px] font-mono text-[var(--accent-cyan)] font-semibold mt-1">
                      {rec.vibe}
                    </div>
                  </div>
                </div>

                {/* Reason Badge */}
                <ReasonBadge reason={rec.reason} />
              </div>

              {/* Card Middle: Details & Curated Description */}
              <div className="space-y-2 z-10">
                <h3 className="font-display font-bold text-xl text-white tracking-tight group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                  {rec.title}
                </h3>
                <p className="text-sm font-semibold text-[var(--text-secondary)] line-clamp-1">
                  {rec.artist}
                </p>
                <div className="pt-2 text-xs text-[var(--text-muted)] leading-relaxed font-body border-t border-white/5 flex items-start gap-1.5">
                  <span className="text-[var(--accent-primary)] mt-0.5 shrink-0">💡</span>
                  <span className="line-clamp-2">{rec.description}</span>
                </div>
              </div>

              {/* Card Bottom: Deep Link & Computed Match Score Pill */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 z-10">
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(`${rec.title} ${rec.artist}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-[var(--accent-primary)] hover:border-[var(--accent-primary)] group/link transition-all"
                >
                  <span>Listen on Spotify</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>

                {/* Match score pill with neon green/cyan styling */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-tight bg-[rgba(0,255,163,0.12)] text-[var(--accent-primary)] border border-[rgba(0,255,163,0.35)] shadow-[0_0_12px_rgba(0,255,163,0.2)]">
                  <Sparkles className="w-3 h-3 text-[var(--accent-cyan)]" />
                  <span>{matchScore}% Match</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
