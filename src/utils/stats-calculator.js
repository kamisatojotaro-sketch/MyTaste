import { categorizeGenre } from '../data/genre-dictionary.js';

/**
 * Computes deep music statistics from normalized PlayEvents array
 * @param {Array<object>} events 
 * @param {object} filters 
 * @returns {object} Full statistical summary
 */
export function computeMusicStats(events, filters = {}) {
  if (!events || events.length === 0) {
    return null;
  }

  // 1. Apply global filters
  let filtered = events.filter(e => {
    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      if (!filters.platforms.includes(e.platform)) return false;
    }
    // Duration filter
    if (filters.minDurationMs && (e.durationMs || 0) < filters.minDurationMs) {
      return false;
    }
    // Date range filter
    if (filters.startDate && new Date(e.timestamp) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(e.timestamp) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) return null;

  // Overview aggregations
  let totalMs = 0;
  const artistMap = new Map();
  const trackMap = new Map();
  const albumMap = new Map();
  const genreMap = new Map();
  const dayMap = new Map(); // "YYYY-MM-DD" -> count & ms
  const hourMap = new Array(24).fill(0);
  const hourDayMatrix = Array.from({ length: 7 }, () => new Array(24).fill(0)); // [0..6 day][0..23 hour]
  const platformCounts = { spotify: 0, youtube_music: 0, youtube: 0, apple_music: 0 };
  const decadeMap = new Map();
  const yearMap = new Map();
  const monthlyTimelineMap = new Map(); // "YYYY-MM" -> { ms, count, genres: {} }

  let totalSkips = 0;
  let totalEvaluatedSkips = 0;
  let totalShufflePlays = 0;
  let totalEvaluatedShuffle = 0;

  // Track obsession tracker: max plays in a single 24-hr day
  const trackDailyPlays = new Map(); // "track:::YYYY-MM-DD" -> count

  for (const ev of filtered) {
    const ms = ev.durationMs || 210000;
    totalMs += ms;

    // Platform
    if (platformCounts[ev.platform] !== undefined) {
      platformCounts[ev.platform]++;
    }

    // Artist
    const artist = ev.artistName || "Unknown Artist";
    if (!artistMap.has(artist)) {
      artistMap.set(artist, { name: artist, plays: 0, ms: 0, tracks: new Set(), firstListened: ev.timestamp });
    }
    const aData = artistMap.get(artist);
    aData.plays++;
    aData.ms += ms;
    aData.tracks.add(ev.trackTitle);

    // Track
    const trackKey = `${ev.trackTitle} — ${artist}`;
    if (!trackMap.has(trackKey)) {
      trackMap.set(trackKey, { 
        title: ev.trackTitle, 
        artist: artist, 
        album: ev.albumName, 
        plays: 0, 
        ms: 0,
        firstListened: ev.timestamp,
        year: ev.year || new Date(ev.timestamp).getFullYear(),
        decade: ev.decade || `${Math.floor(new Date(ev.timestamp).getFullYear() / 10) * 10}s`
      });
    }
    const tData = trackMap.get(trackKey);
    tData.plays++;
    tData.ms += ms;

    // Album
    if (ev.albumName) {
      const albumKey = `${ev.albumName} — ${artist}`;
      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, { album: ev.albumName, artist: artist, plays: 0, ms: 0 });
      }
      const albData = albumMap.get(albumKey);
      albData.plays++;
      albData.ms += ms;
    }

    // Genre
    const macroGenre = categorizeGenre(ev.genre || artist);
    genreMap.set(macroGenre, (genreMap.get(macroGenre) || 0) + 1);

    // Temporal
    const dateObj = new Date(ev.timestamp);
    const dateStr = dateObj.toISOString().split('T')[0];
    const monthKey = dateStr.substring(0, 7);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    const hour = dateObj.getHours();

    hourMap[hour]++;
    hourDayMatrix[dayOfWeek][hour]++;

    if (!dayMap.has(dateStr)) {
      dayMap.set(dateStr, { date: dateStr, count: 0, ms: 0 });
    }
    const dData = dayMap.get(dateStr);
    dData.count++;
    dData.ms += ms;

    // Monthly timeline
    if (!monthlyTimelineMap.has(monthKey)) {
      monthlyTimelineMap.set(monthKey, { month: monthKey, ms: 0, count: 0, genres: {} });
    }
    const mData = monthlyTimelineMap.get(monthKey);
    mData.ms += ms;
    mData.count++;
    mData.genres[macroGenre] = (mData.genres[macroGenre] || 0) + 1;

    // Obsession counter
    const dailyTrackKey = `${trackKey}:::${dateStr}`;
    trackDailyPlays.set(dailyTrackKey, (trackDailyPlays.get(dailyTrackKey) || 0) + 1);

    // Decades & Years
    const songDecade = tData.decade;
    decadeMap.set(songDecade, (decadeMap.get(songDecade) || 0) + 1);

    const playYear = dateObj.getFullYear();
    yearMap.set(playYear, (yearMap.get(playYear) || 0) + 1);

    // Skips & Shuffle (if available)
    if (ev.skipped !== null && ev.skipped !== undefined) {
      totalEvaluatedSkips++;
      if (ev.skipped) totalSkips++;
    }
    if (ev.shuffle !== null && ev.shuffle !== undefined) {
      totalEvaluatedShuffle++;
      if (ev.shuffle) totalShufflePlays++;
    }
  }

  // Calculate top listening day
  let biggestDay = { date: "N/A", count: 0, ms: 0 };
  for (const [date, val] of dayMap.entries()) {
    if (val.ms > biggestDay.ms) {
      biggestDay = val;
    }
  }

  // Calculate current & longest listening streak
  const sortedDates = Array.from(dayMap.keys()).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dStr of sortedDates) {
    const cur = new Date(dStr);
    if (prevDate) {
      const diffDays = Math.round((cur - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = cur;
  }
  currentStreak = tempStreak;

  // Top Artists (by play count and listening hours)
  const allArtists = Array.from(artistMap.values());
  const topArtistsByPlays = [...allArtists].sort((a, b) => b.plays - a.plays).slice(0, 50);
  const topArtistsByDuration = [...allArtists].sort((a, b) => b.ms - a.ms).slice(0, 50);

  // Top Songs
  const allTracks = Array.from(trackMap.values());
  const topTracks = [...allTracks].sort((a, b) => b.plays - a.plays).slice(0, 50);

  // Top Albums
  const allAlbums = Array.from(albumMap.values());
  const topAlbums = [...allAlbums].sort((a, b) => b.plays - a.plays).slice(0, 25);

  // Obsession Index (Max replays in 24 hours)
  let maxDailyReplays = 0;
  let obsessedSong = null;
  for (const [key, count] of trackDailyPlays.entries()) {
    if (count > maxDailyReplays) {
      maxDailyReplays = count;
      const [fullTrack, date] = key.split(':::');
      obsessedSong = { track: fullTrack, count, date };
    }
  }

  // One-hit wonders (1 track listened to 10+ times, but 0 other catalog plays)
  const oneHitWonders = allArtists
    .filter(a => a.tracks.size === 1 && a.plays >= 5)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);

  // Listening Archetype personality calculation
  let personality = "The Sonic Explorer";
  let personalityDesc = "You roam freely across multiple genres, craving fresh discoveries and eclectic vibrations.";
  const topGenreEntry = Array.from(genreMap.entries()).sort((a, b) => b[1] - a[1])[0];
  const uniqueArtistCount = allArtists.length;
  const ratio = uniqueArtistCount / filtered.length;

  if (ratio > 0.4) {
    personality = "The Deep Explorer";
    personalityDesc = "An insatiable appetite for new sounds. You rarely get stuck on repeats and explore thousands of unique artists.";
  } else if (ratio < 0.15) {
    personality = "The Devoted Loyalist";
    personalityDesc = "When you love an artist, you stream their full discography on repeat day and night. True superfan energy.";
  } else if (topGenreEntry && topGenreEntry[0].includes("Electronic")) {
    personality = "The Night-Rave Alchemist";
    personalityDesc = "Fueled by high-energy drops, synthwave pulses, and hypnotic electronic soundscapes.";
  } else if (topGenreEntry && topGenreEntry[0].includes("Indie")) {
    personality = "The Melancholy Aesthete";
    personalityDesc = "Drawn to poetic lyrics, dreamy guitars, and introspective soundscapes with indie authenticity.";
  } else if (topGenreEntry && topGenreEntry[0].includes("Hip-Hop")) {
    personality = "The Heavy Hitter";
    personalityDesc = "You gravitate towards hard-hitting 808s, lyrical mastery, and infectious trap rhythms.";
  }

  // Artist H-Index (Citation index: H artists listened to at least H times)
  const sortedArtistPlays = allArtists.map(a => a.plays).sort((a, b) => b - a);
  let hIndex = 0;
  for (let i = 0; i < sortedArtistPlays.length; i++) {
    if (sortedArtistPlays[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }

  // Decades breakdown list
  const decadesDistribution = Array.from(decadeMap.entries())
    .map(([decade, count]) => ({ decade, count, percent: Math.round((count / filtered.length) * 100) }))
    .sort((a, b) => b.count - a.count);

  return {
    totalMinutes: Math.round(totalMs / 60000),
    totalHours: (totalMs / (1000 * 60 * 60)).toFixed(1),
    totalDaysContinuous: (totalMs / (1000 * 60 * 60 * 24)).toFixed(1),
    totalStreams: filtered.length,
    uniqueArtists: uniqueArtistCount,
    uniqueTracks: allTracks.length,
    uniqueAlbums: allAlbums.length,
    biggestDay: {
      date: biggestDay.date,
      hours: (biggestDay.ms / (1000 * 60 * 60)).toFixed(1),
      count: biggestDay.count
    },
    streaks: {
      current: currentStreak,
      longest: longestStreak
    },
    platformSplit: platformCounts,
    topArtistsByPlays,
    topArtistsByDuration,
    topTracks,
    topAlbums,
    genres: Array.from(genreMap.entries()).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count),
    hourlyDistribution: hourMap,
    hourDayMatrix: hourDayMatrix,
    dailyTimeline: Array.from(dayMap.values()),
    monthlyTimeline: Array.from(monthlyTimelineMap.values()),
    decades: decadesDistribution,
    behavior: {
      skipRate: totalEvaluatedSkips > 0 ? Math.round((totalSkips / totalEvaluatedSkips) * 100) : null,
      shufflePercent: totalEvaluatedShuffle > 0 ? Math.round((totalShufflePlays / totalEvaluatedShuffle) * 100) : null,
      completionRate: totalEvaluatedSkips > 0 ? 100 - Math.round((totalSkips / totalEvaluatedSkips) * 100) : null
    },
    funStats: {
      obsessedSong,
      oneHitWonders,
      personality,
      personalityDesc,
      hIndex,
      topGenre: topGenreEntry ? topGenreEntry[0] : "Various",
      timeMachineYear: decadesDistribution[0] ? decadesDistribution[0].decade : "2020s"
    }
  };
}
