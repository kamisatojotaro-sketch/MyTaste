// Static artist-to-macro-genre mapping dictionary (covers 100+ top artists across all categories)
export const ARTIST_GENRES = {
  // Pop / Dance Pop
  "The Weeknd": "R&B / Pop",
  "Taylor Swift": "Pop",
  "Drake": "Hip-Hop / Rap",
  "Billie Eilish": "Alternative Pop",
  "Dua Lipa": "Dance Pop",
  "Ariana Grande": "Pop / R&B",
  "Harry Styles": "Pop / Rock",
  "Olivia Rodrigo": "Pop Rock",
  "Bruno Mars": "Funk / Pop",
  "Ed Sheeran": "Pop / Acoustic",
  "Justin Bieber": "Pop",
  "Post Malone": "Hip-Hop / Pop",
  "Sabrina Carpenter": "Pop",
  "Chappell Roan": "Synth Pop",
  "Charli xcx": "Hyperpop",
  "SZA": "R&B",
  "Beyoncé": "R&B / Pop",
  "Rihanna": "R&B / Pop",
  "Lady Gaga": "Dance Pop",
  "Katy Perry": "Pop",

  // Hip-Hop / Rap
  "Kendrick Lamar": "Hip-Hop / Rap",
  "Kanye West": "Hip-Hop",
  "Travis Scott": "Trap / Hip-Hop",
  "Eminem": "Hip-Hop / Rap",
  "J. Cole": "Hip-Hop",
  "Metro Boomin": "Trap",
  "Future": "Trap / Hip-Hop",
  "21 Savage": "Trap",
  "Lil Baby": "Trap",
  "Playboi Carti": "Rage / Hip-Hop",
  "Tyler, The Creator": "Alternative Hip-Hop",
  "A$AP Rocky": "Hip-Hop",
  "Juice WRLD": "Emo Rap",
  "Mac Miller": "Hip-Hop / Jazz",
  "Lil Uzi Vert": "Trap",
  "Gunna": "Trap",
  "Doja Cat": "Pop Rap",
  "Nicki Minaj": "Hip-Hop",
  "Childish Gambino": "R&B / Funk",
  "NF": "Hip-Hop",

  // Rock / Indie / Alternative
  "Arctic Monkeys": "Indie Rock",
  "The Neighbourhood": "Indie Rock",
  "Radiohead": "Art Rock / Alternative",
  "Coldplay": "Alternative Rock",
  "Imagine Dragons": "Alternative Pop",
  "Queen": "Classic Rock",
  "The Beatles": "Classic Rock",
  "Pink Floyd": "Progressive Rock",
  "Nirvana": "Grunge / Rock",
  "Linkin Park": "Nu Metal / Rock",
  "Red Hot Chili Peppers": "Funk Rock",
  "Fleetwood Mac": "Classic Rock",
  "Gorillaz": "Alternative / Electronic",
  "Tame Impala": "Psychedelic Pop",
  "Lana Del Rey": "Indie Pop",
  "The Strokes": "Indie Rock",
  "The 1975": "Indie Pop",
  "Twenty One Pilots": "Alternative",
  "Glass Animals": "Indie Pop",
  "Foster The People": "Indie Pop",
  "Wallows": "Indie Rock",
  "Dominic Fike": "Alternative / Indie",
  "Cigarettes After Sex": "Dream Pop",
  "boygenius": "Indie Folk",
  "Phoebe Bridgers": "Indie Folk",
  "Mitski": "Indie Rock",

  // Electronic / EDM / Synthwave / Ambient
  "Daft Punk": "Electronic / French House",
  "Avicii": "EDM / House",
  "Calvin Harris": "Dance / EDM",
  "The Chainsmokers": "EDM / Pop",
  "Marshmello": "EDM",
  "Martin Garrix": "EDM / House",
  "David Guetta": "Dance / EDM",
  "Skrillex": "Electronic / Dubstep",
  "Kygo": "Tropical House",
  "Fred again..": "Electronic / House",
  "Odesza": "Electronic / Chillwave",
  "Flume": "Future Bass",
  "Kavinsky": "Synthwave",
  "HOME": "Synthwave / Chillwave",
  "C418": "Ambient / Game OST",
  "Aphex Twin": "IDM / Ambient",
  "Hans Zimmer": "Film Score / Orchestral",
  "Ludovico Einaudi": "Modern Classical",
  "Lofi Girl": "Lo-Fi Beats",
  "ChilledCow": "Lo-Fi Beats",

  // Latin / Reggaeton
  "Bad Bunny": "Reggaeton / Latin Trap",
  "Rauw Alejandro": "Latin R&B",
  "J Balvin": "Reggaeton",
  "Feid": "Reggaeton",
  "Karol G": "Reggaeton / Latin Pop",
  "Peso Pluma": "Corridos Tumbados",
  "Rosalía": "Flamenco Pop",

  // K-Pop
  "BTS": "K-Pop",
  "BLACKPINK": "K-Pop",
  "NewJeans": "K-Pop / R&B",
  "Stray Kids": "K-Pop",
  "TWICE": "K-Pop",
  "LE SSERAFIM": "K-Pop",
  "IVE": "K-Pop",
  "Jung Kook": "K-Pop / Pop",

  // Metal / Hard Rock
  "Metallica": "Thrash Metal",
  "Slipknot": "Nu Metal",
  "Deftones": "Alternative Metal",
  "Bring Me The Horizon": "Metalcore / Rock",
  "Sleep Token": "Progressive Metal",
  "Rammstein": "Industrial Metal",
  "Avenged Sevenfold": "Heavy Metal"
};

export const MACRO_GENRES = [
  "Pop",
  "Hip-Hop / Rap",
  "Indie & Alternative",
  "Rock & Metal",
  "Electronic & Dance",
  "R&B & Soul",
  "K-Pop & Asian Pop",
  "Latin & Reggaeton",
  "Ambient & Lo-Fi",
  "Soundtrack & Classical",
  "Other"
];

export function categorizeGenre(genreOrArtist) {
  if (!genreOrArtist) return "Other";
  const lower = genreOrArtist.toLowerCase();
  
  if (lower.includes("pop") && !lower.includes("k-pop") && !lower.includes("indie")) return "Pop";
  if (lower.includes("rap") || lower.includes("hip-hop") || lower.includes("hip hop") || lower.includes("trap") || lower.includes("drill")) return "Hip-Hop / Rap";
  if (lower.includes("indie") || lower.includes("alt") || lower.includes("dream pop") || lower.includes("shoegaze") || lower.includes("folk")) return "Indie & Alternative";
  if (lower.includes("rock") || lower.includes("metal") || lower.includes("grunge") || lower.includes("punk")) return "Rock & Metal";
  if (lower.includes("electro") || lower.includes("house") || lower.includes("edm") || lower.includes("dance") || lower.includes("techno") || lower.includes("synth") || lower.includes("bass") || lower.includes("dubstep")) return "Electronic & Dance";
  if (lower.includes("r&b") || lower.includes("soul") || lower.includes("funk") || lower.includes("gospel")) return "R&B & Soul";
  if (lower.includes("k-pop") || lower.includes("kpop") || lower.includes("j-pop") || lower.includes("anime")) return "K-Pop & Asian Pop";
  if (lower.includes("latin") || lower.includes("reggaeton") || lower.includes("corrido") || lower.includes("salsa")) return "Latin & Reggaeton";
  if (lower.includes("lo-fi") || lower.includes("lofi") || lower.includes("ambient") || lower.includes("chill")) return "Ambient & Lo-Fi";
  if (lower.includes("classical") || lower.includes("score") || lower.includes("soundtrack") || lower.includes("orchestra") || lower.includes("piano")) return "Soundtrack & Classical";

  return "Other";
}

export function getArtistGenre(artistName) {
  if (!artistName) return "Other";
  const cleanName = artistName.replace(/\s*-\s*Topic$/i, "").trim();
  
  if (ARTIST_GENRES[cleanName]) {
    return ARTIST_GENRES[cleanName];
  }
  
  // Try case-insensitive lookup
  for (const [key, val] of Object.entries(ARTIST_GENRES)) {
    if (key.toLowerCase() === cleanName.toLowerCase()) {
      return val;
    }
  }
  
  return "Alternative / Pop";
}
