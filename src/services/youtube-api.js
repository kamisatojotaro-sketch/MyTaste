// Direct YouTube & YouTube Music OAuth Connection Helper
export function connectYouTubeAccount() {
  // Google OAuth 2.0 endpoint for YouTube Read-Only scopes
  const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const CLIENT_ID = localStorage.getItem("mytaste_google_client_id") || "sample-client-id";
  const REDIRECT_URI = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: SCOPE,
    include_granted_scopes: "true"
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}
