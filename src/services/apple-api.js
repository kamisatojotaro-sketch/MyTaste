// Direct Apple MusicKit connection helper
export function initMusicKit() {
  if (typeof window !== "undefined" && window.MusicKit) {
    return window.MusicKit.getInstance();
  }
  return null;
}

export async function authorizeAppleMusic() {
  const musicKit = initMusicKit();
  if (musicKit) {
    return await musicKit.authorize();
  }
  return null;
}
