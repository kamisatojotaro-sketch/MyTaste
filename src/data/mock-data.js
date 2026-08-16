// Realistic simulated listening history generator for immediate demo / testing
import { getArtistGenre } from './genre-dictionary.js';

const MOCK_ARTISTS_CATALOG = [
  {
    artist: "The Weeknd",
    albums: ["After Hours", "Starboy", "Dawn FM"],
    tracks: [
      { title: "Blinding Lights", duration: 200040, year: 2020, decade: "2020s" },
      { title: "Starboy", duration: 230453, year: 2016, decade: "2010s" },
      { title: "Save Your Tears", duration: 215626, year: 2020, decade: "2020s" },
      { title: "The Hills", duration: 242253, year: 2015, decade: "2010s" },
      { title: "Die For You", duration: 260253, year: 2016, decade: "2010s" },
      { title: "Out of Time", duration: 214293, year: 2022, decade: "2020s" }
    ]
  },
  {
    artist: "Arctic Monkeys",
    albums: ["AM", "Favourite Worst Nightmare", "Whatever People Say I Am"],
    tracks: [
      { title: "Do I Wanna Know?", duration: 272386, year: 2013, decade: "2010s" },
      { title: "505", duration: 253586, year: 2007, decade: "2000s" },
      { title: "R U Mine?", duration: 201746, year: 2013, decade: "2010s" },
      { title: "Why'd You Only Call Me When You're High?", duration: 161080, year: 2013, decade: "2010s" },
      { title: "I Wanna Be Yours", duration: 183973, year: 2013, decade: "2010s" },
      { title: "Fluorescent Adolescent", duration: 177506, year: 2007, decade: "2000s" }
    ]
  },
  {
    artist: "Daft Punk",
    albums: ["Discovery", "Random Access Memories", "Homework"],
    tracks: [
      { title: "Get Lucky", duration: 369626, year: 2013, decade: "2010s" },
      { title: "One More Time", duration: 320346, year: 2001, decade: "2000s" },
      { title: "Harder, Better, Faster, Stronger", duration: 224693, year: 2001, decade: "2000s" },
      { title: "Instant Crush", duration: 337560, year: 2013, decade: "2010s" },
      { title: "Around the World", duration: 429533, year: 1997, decade: "1990s" }
    ]
  },
  {
    artist: "Lana Del Rey",
    albums: ["Born To Die", "Norman Fucking Rockwell!", "Ultraviolence"],
    tracks: [
      { title: "Summertime Sadness", duration: 265266, year: 2012, decade: "2010s" },
      { title: "Video Games", duration: 282000, year: 2011, decade: "2010s" },
      { title: "Young and Beautiful", duration: 236053, year: 2013, decade: "2010s" },
      { title: "Doin' Time", duration: 202160, year: 2019, decade: "2010s" },
      { title: "West Coast", duration: 257000, year: 2014, decade: "2010s" }
    ]
  },
  {
    artist: "Kendrick Lamar",
    albums: ["DAMN.", "good kid, m.A.A.d city", "Mr. Morale & The Big Steppers"],
    tracks: [
      { title: "HUMBLE.", duration: 177000, year: 2017, decade: "2010s" },
      { title: "Not Like Us", duration: 274000, year: 2024, decade: "2020s" },
      { title: "Money Trees", duration: 386906, year: 2012, decade: "2010s" },
      { title: "DNA.", duration: 185946, year: 2017, decade: "2010s" },
      { title: "All The Stars", duration: 232186, year: 2018, decade: "2010s" }
    ]
  },
  {
    artist: "Gorillaz",
    albums: ["Demon Days", "Plastic Beach", "Gorillaz"],
    tracks: [
      { title: "Feel Good Inc.", duration: 222640, year: 2005, decade: "2000s" },
      { title: "On Melancholy Hill", duration: 233866, year: 2010, decade: "2010s" },
      { title: "Clint Eastwood", duration: 340920, year: 2001, decade: "2000s" },
      { title: "Dare", duration: 244973, year: 2005, decade: "2000s" }
    ]
  },
  {
    artist: "Tame Impala",
    albums: ["Currents", "The Slow Rush", "Lonerism"],
    tracks: [
      { title: "The Less I Know The Better", duration: 216320, year: 2015, decade: "2010s" },
      { title: "Borderline", duration: 237880, year: 2020, decade: "2020s" },
      { title: "Let It Happen", duration: 467586, year: 2015, decade: "2010s" },
      { title: "Feels Like We Only Go Backwards", duration: 192800, year: 2012, decade: "2010s" }
    ]
  },
  {
    artist: "Travis Scott",
    albums: ["ASTROWORLD", "UTOPIA", "Rodeo"],
    tracks: [
      { title: "SICKO MODE", duration: 312820, year: 2018, decade: "2010s" },
      { title: "FE!N", duration: 191700, year: 2023, decade: "2020s" },
      { title: "Goosebumps", duration: 243853, year: 2016, decade: "2010s" },
      { title: "MY EYES", duration: 251249, year: 2023, decade: "2020s" }
    ]
  },
  {
    artist: "Billie Eilish",
    albums: ["HIT ME HARD AND SOFT", "WHEN WE ALL FALL ASLEEP", "Happier Than Ever"],
    tracks: [
      { title: "BIRDS OF A FEATHER", duration: 190373, year: 2024, decade: "2020s" },
      { title: "bad guy", duration: 194087, year: 2019, decade: "2010s" },
      { title: "LUNCH", duration: 179000, year: 2024, decade: "2020s" },
      { title: "lovely", duration: 200185, year: 2018, decade: "2010s" }
    ]
  },
  {
    artist: "Radiohead",
    albums: ["OK Computer", "In Rainbows", "Kid A"],
    tracks: [
      { title: "Karma Police", duration: 261946, year: 1997, decade: "1990s" },
      { title: "Creep", duration: 238640, year: 1992, decade: "1990s" },
      { title: "No Surprises", duration: 228800, year: 1997, decade: "1990s" },
      { title: "Weird Fishes/ Arpeggi", duration: 318306, year: 2007, decade: "2000s" }
    ]
  }
];

export function generateMockHistory() {
  const events = [];
  const platforms = ['spotify', 'youtube_music', 'youtube', 'apple_music'];
  const platformsWeight = [0.55, 0.25, 0.12, 0.08];
  
  const now = new Date();
  const startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year of history
  
  let idCounter = 1;
  
  // Weights for artists to make some top favorites
  const artistWeights = [35, 28, 22, 18, 16, 14, 12, 11, 10, 8];
  
  for (let day = 0; day < 365; day++) {
    const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
    // Listeners have varying activity per day (weekday vs weekend)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const count = isWeekend ? Math.floor(Math.random() * 18 + 8) : Math.floor(Math.random() * 12 + 4);
    
    for (let i = 0; i < count; i++) {
      // Pick artist based on weighted distribution
      const totalWeight = artistWeights.reduce((a, b) => a + b, 0);
      let rand = Math.random() * totalWeight;
      let artistIdx = 0;
      for (let j = 0; j < artistWeights.length; j++) {
        if (rand < artistWeights[j]) {
          artistIdx = j;
          break;
        }
        rand -= artistWeights[j];
      }
      
      const artistData = MOCK_ARTISTS_CATALOG[artistIdx];
      const trackObj = artistData.tracks[Math.floor(Math.random() * artistData.tracks.length)];
      const album = artistData.albums[Math.floor(Math.random() * artistData.albums.length)];
      
      // Determine hour of day: realistic circadian curve (morning commute, afternoon work, late night)
      let hour;
      const hourRand = Math.random();
      if (hourRand < 0.15) {
        hour = Math.floor(Math.random() * 4) + 8; // 8am - 11am (morning)
      } else if (hourRand < 0.45) {
        hour = Math.floor(Math.random() * 5) + 13; // 1pm - 5pm (work)
      } else if (hourRand < 0.85) {
        hour = Math.floor(Math.random() * 4) + 19; // 7pm - 10pm (evening)
      } else {
        hour = Math.floor(Math.random() * 4) + 21; // 9pm - 12am (night)
      }
      
      const eventTime = new Date(currentDate);
      eventTime.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      
      // Platform pick
      const pRand = Math.random();
      let platform = 'spotify';
      let cumWeight = 0;
      for (let p = 0; p < platforms.length; p++) {
        cumWeight += platformsWeight[p];
        if (pRand <= cumWeight) {
          platform = platforms[p];
          break;
        }
      }
      
      const skipped = Math.random() < 0.12; // 12% skip rate
      const shuffle = Math.random() < 0.48; // 48% shuffle
      const durationMs = skipped ? Math.floor(trackObj.duration * (Math.random() * 0.4)) : trackObj.duration;
      
      events.push({
        id: `mock-${idCounter++}`,
        timestamp: eventTime.toISOString(),
        trackTitle: trackObj.title,
        artistName: artistData.artist,
        albumName: album,
        durationMs: durationMs,
        genre: getArtistGenre(artistData.artist),
        year: trackObj.year,
        decade: trackObj.decade,
        platform: platform,
        skipped: platform === 'spotify' ? skipped : null,
        shuffle: platform === 'spotify' ? shuffle : null,
        device: Math.random() > 0.4 ? 'Mobile (iOS/Android)' : (Math.random() > 0.5 ? 'Desktop Web/App' : 'Smart Speaker'),
        source: platform === 'spotify' ? 'spotify_extended' : (platform.includes('youtube') ? 'takeout_json' : 'apple_csv')
      });
    }
  }
  
  // Sort chronologically
  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
