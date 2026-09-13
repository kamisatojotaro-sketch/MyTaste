// 100% Client-side Spotify OAuth with PKCE (No backend needed)
const SPOTIFY_CLIENT_ID = "c74f51e04b404d0c83a7c64d85202685"; // Default client id, users can also provide their own
const REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/` : "http://localhost:3000/";
const SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "user-read-playback-position"
].join(" ");

function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function redirectToSpotifyAuth(customClientId) {
  const clientId = customClientId || localStorage.getItem("mytaste_spotify_client_id") || SPOTIFY_CLIENT_ID;
  const verifier = generateRandomString(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("spotify_verifier", verifier);
  localStorage.setItem("spotify_client_id", clientId);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getSpotifyAccessToken(code) {
  const verifier = localStorage.getItem("spotify_verifier");
  const clientId = localStorage.getItem("spotify_client_id") || SPOTIFY_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Spotify API");
  }

  const data = await response.json();
  localStorage.setItem("spotify_access_token", data.access_token);
  return data.access_token;
}

export async function fetchDirectSpotifyData(token) {
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch Top Tracks (All Time / Long Term)
  const topTracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", { headers });
  const topTracksData = await topTracksRes.json();

  // Fetch Top Artists
  const topArtistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", { headers });
  const topArtistsData = await topArtistsRes.json();

  // Fetch Recently Played Tracks
  const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", { headers });
  const recentData = await recentRes.json();

  const events = [];
  let id = 1;

  if (topTracksData.items) {
    topTracksData.items.forEach((item, index) => {
      const multiplier = Math.max(50 - index, 5); // Realistic play count weighting for top items
      for (let p = 0; p < multiplier; p++) {
        const timeOffset = p * (24 * 60 * 60 * 1000) * 4;
        events.push({
          id: `sp-direct-${id++}`,
          timestamp: new Date(Date.now() - timeOffset).toISOString(),
          trackTitle: item.name,
          artistName: item.artists[0]?.name || "Spotify Artist",
          albumName: item.album?.name || null,
          durationMs: item.duration_ms || 210000,
          genre: item.artists[0]?.genres?.[0] || "Pop",
          platform: "spotify",
          skipped: false,
          shuffle: true,
          device: "Spotify Connected Account",
          offline: false,
          source: "spotify_api"
        });
      }
    });
  }

  if (recentData.items) {
    recentData.items.forEach((item) => {
      events.push({
        id: `sp-direct-${id++}`,
        timestamp: item.played_at || new Date().toISOString(),
        trackTitle: item.track?.name || "Recent Track",
        artistName: item.track?.artists?.[0]?.name || "Artist",
        albumName: item.track?.album?.name || null,
        durationMs: item.track?.duration_ms || 210000,
        genre: "Pop",
        platform: "spotify",
        skipped: false,
        shuffle: false,
        device: "Spotify Connected Account",
        offline: false,
        source: "spotify_api"
      });
    });
  }

  return events;
}
