import { getArtistGenre } from '../data/genre-dictionary.js';

/**
 * Parses Google Takeout YouTube and YouTube Music watch history files (.json and .html)
 * @param {Array<{name: string, content: string}>} files 
 * @returns {Array<object>} Unified PlayEvents
 */
export function parseYouTubeFiles(files) {
  const events = [];
  let idCounter = 1;

  for (const file of files) {
    if (file.name.endsWith('.json')) {
      let jsonArray;
      try {
        jsonArray = JSON.parse(file.content);
      } catch (e) {
        console.warn(`Failed to parse ${file.name} as JSON`, e);
        continue;
      }

      if (!Array.isArray(jsonArray)) continue;

      for (const item of jsonArray) {
        if (!item.title || !item.time) continue;

        // Clean track title (strip "Watched ")
        let title = item.title.replace(/^Watched\s+/i, '').replace(/^A regardé\s+/i, '').trim();
        if (!title) continue;

        // Extract channel / artist name
        let artist = "YouTube Artist";
        let isDedicatedMusic = false;

        if (item.header === "YouTube Music" || (item.products && item.products.includes("YouTube Music"))) {
          isDedicatedMusic = true;
        }

        if (item.subtitles && item.subtitles.length > 0 && item.subtitles[0].name) {
          artist = item.subtitles[0].name;
          if (artist.endsWith(" - Topic")) {
            isDedicatedMusic = true;
            artist = artist.replace(/\s*-\s*Topic$/i, "").trim();
          }
        }

        // If from regular YouTube, apply music heuristics (Topic / VEVO / Official Audio / Video)
        if (!isDedicatedMusic) {
          if (artist.includes("VEVO") || artist.includes("Records") || title.includes("Official Audio") || title.includes("Official Music Video") || title.includes("Official Video") || title.includes("Lyric Video")) {
            isDedicatedMusic = true;
            // Clean title
            title = title.replace(/\(Official (Music )?Video\)/i, '')
                         .replace(/\[Official (Music )?Video\]/i, '')
                         .replace(/\(Official Audio\)/i, '')
                         .replace(/\[Official Audio\]/i, '')
                         .replace(/\(Lyric Video\)/i, '')
                         .trim();
          }
        }

        // Only include identified music events
        if (isDedicatedMusic) {
          const platform = item.header === "YouTube Music" ? "youtube_music" : "youtube";
          events.push({
            id: `yt-${idCounter++}`,
            timestamp: item.time,
            trackTitle: title,
            artistName: artist,
            albumName: null,
            durationMs: 210000, // Estimated 3.5 min average for YouTube Takeout records without duration
            genre: getArtistGenre(artist),
            platform: platform,
            skipped: null,
            shuffle: null,
            device: 'YouTube Player',
            offline: false,
            source: 'takeout_json'
          });
        }
      }
    } else if (file.name.endsWith('.html')) {
      // Parse HTML watch history using regex tokenizer
      const itemRegex = /<div class="content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1">([\s\S]*?)<\/div>/gi;
      let match;
      while ((match = itemRegex.exec(file.content)) !== null) {
        const cellContent = match[1];
        
        // Extract title link
        const titleMatch = /Watched\s+<a[^>]*>([^<]+)<\/a>/i.exec(cellContent);
        // Extract channel link
        const channelMatch = /<a[^>]*>([^<]+)<\/a><br>([A-Za-z0-9,\s:]+(?:PM|AM|UTC))/i.exec(cellContent);

        if (titleMatch) {
          let title = titleMatch[1].trim();
          let artist = channelMatch ? channelMatch[1].trim() : "YouTube Artist";
          let isMusic = false;

          if (artist.endsWith(" - Topic")) {
            isMusic = true;
            artist = artist.replace(/\s*-\s*Topic$/i, "").trim();
          } else if (artist.includes("VEVO") || title.includes("Official Audio") || title.includes("Official Video")) {
            isMusic = true;
          }

          if (isMusic) {
            events.push({
              id: `yt-html-${idCounter++}`,
              timestamp: new Date().toISOString(), // Fallback parsed time
              trackTitle: title,
              artistName: artist,
              albumName: null,
              durationMs: 210000,
              genre: getArtistGenre(artist),
              platform: 'youtube',
              skipped: null,
              shuffle: null,
              device: 'YouTube Web/App',
              offline: false,
              source: 'takeout_html'
            });
          }
        }
      }
    }
  }

  return events;
}
