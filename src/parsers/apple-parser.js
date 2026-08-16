import Papa from 'papaparse';
import { getArtistGenre } from '../data/genre-dictionary.js';

/**
 * Parses Apple Music CSV / JSON exports (from Apple Media Services)
 * @param {Array<{name: string, content: string}>} files 
 * @returns {Array<object>} Unified PlayEvents
 */
export function parseAppleMusicFiles(files) {
  const events = [];
  let idCounter = 1;

  for (const file of files) {
    if (file.name.endsWith('.csv')) {
      const parsed = Papa.parse(file.content, {
        header: true,
        skipEmptyLines: true
      });

      if (!parsed.data || !Array.isArray(parsed.data)) continue;

      for (const row of parsed.data) {
        // Apple Music CSV standard columns: Track Description, Container Description, Artist Name, Genre, Play Duration Milliseconds, End Position Milliseconds, UTC Event Date
        const track = row['Track Description'] || row['Song Name'] || row['Title'];
        const artist = row['Artist Name'] || row['Artist'];
        if (!track || !artist) continue;

        const duration = parseInt(row['Play Duration Milliseconds'] || row['Duration'] || '200000', 10);
        const timestamp = row['UTC Event Date'] || row['Event Date'] || row['Date'] || new Date().toISOString();
        const genre = row['Genre'] || getArtistGenre(artist);

        events.push({
          id: `apple-${idCounter++}`,
          timestamp: new Date(timestamp).toISOString(),
          trackTitle: track,
          artistName: artist,
          albumName: row['Container Description'] || row['Album'] || null,
          durationMs: isNaN(duration) ? 200000 : duration,
          genre: genre,
          platform: 'apple_music',
          skipped: null,
          shuffle: null,
          device: 'Apple Device',
          offline: false,
          source: 'apple_csv'
        });
      }
    } else if (file.name.endsWith('.json')) {
      try {
        const jsonArray = JSON.parse(file.content);
        if (Array.isArray(jsonArray)) {
          for (const item of jsonArray) {
            const track = item.trackName || item.title;
            const artist = item.artistName || item.artist;
            if (!track || !artist) continue;

            events.push({
              id: `apple-json-${idCounter++}`,
              timestamp: item.timestamp || item.date || new Date().toISOString(),
              trackTitle: track,
              artistName: artist,
              albumName: item.albumName || null,
              durationMs: item.durationMs || 200000,
              genre: item.genre || getArtistGenre(artist),
              platform: 'apple_music',
              skipped: null,
              shuffle: null,
              device: 'Apple Music App',
              offline: false,
              source: 'apple_json'
            });
          }
        }
      } catch (e) {
        console.warn('Failed to parse Apple Music JSON:', e);
      }
    }
  }

  return events;
}
