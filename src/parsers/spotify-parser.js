import { getArtistGenre } from '../data/genre-dictionary.js';

/**
 * Parses Spotify JSON files (both standard and extended history)
 * @param {Array<{name: string, content: string}>} files 
 * @returns {Array<object>} Unified PlayEvents
 */
export function parseSpotifyFiles(files) {
  const events = [];
  let idCounter = 1;
  
  for (const file of files) {
    if (!file.name.endsWith('.json')) continue;
    
    let jsonArray;
    try {
      jsonArray = JSON.parse(file.content);
    } catch (e) {
      console.warn(`Failed to parse ${file.name} as JSON`, e);
      continue;
    }
    
    if (!Array.isArray(jsonArray)) continue;
    
    for (const item of jsonArray) {
      // 1. Check if Extended Streaming History format (endsong_*.json)
      if (item.ts !== undefined && (item.master_metadata_track_name !== undefined || item.spotify_track_uri !== undefined)) {
        // Exclude podcasts if track name is empty or episode_name is present
        const trackTitle = item.master_metadata_track_name;
        const artistName = item.master_metadata_album_artist_name;
        if (!trackTitle || !artistName) continue;
        
        const msPlayed = item.ms_played || 0;
        // Spotify 30s rule: valid streams are >= 30,000 ms
        if (msPlayed < 30000 && !item.skipped) continue;
        
        events.push({
          id: `sp-ext-${idCounter++}`,
          timestamp: item.ts,
          trackTitle: trackTitle,
          artistName: artistName,
          albumName: item.master_metadata_album_album_name || null,
          durationMs: msPlayed,
          genre: getArtistGenre(artistName),
          platform: 'spotify',
          skipped: item.skipped === true || item.reason_end === 'fwdbtn',
          shuffle: item.shuffle === true,
          device: item.platform || 'Spotify Client',
          offline: item.offline === true,
          source: 'spotify_extended'
        });
      }
      // 2. Check if Standard Streaming History format (StreamingHistory_music_*.json)
      else if (item.endTime !== undefined && item.trackName !== undefined && item.artistName !== undefined) {
        const msPlayed = item.msPlayed || 0;
        if (msPlayed < 30000) continue;
        
        events.push({
          id: `sp-std-${idCounter++}`,
          timestamp: new Date(item.endTime).toISOString(),
          trackTitle: item.trackName,
          artistName: item.artistName,
          albumName: null,
          durationMs: msPlayed,
          genre: getArtistGenre(item.artistName),
          platform: 'spotify',
          skipped: null,
          shuffle: null,
          device: null,
          offline: null,
          source: 'spotify_standard'
        });
      }
    }
  }
  
  return events;
}
