# 🎵 MyTaste — Personal Music Statistics Dashboard

> A privacy-first, 100% client-side music statistics platform that ingests Spotify, YouTube Music, YouTube, and Apple Music data exports.

---

## ✨ Features

- 🔒 **100% Client-Side Processing**: Zero server uploads. All `.zip`, `.json`, `.csv`, and `.html` files are processed in-browser memory.
- 📦 **Multi-Platform Support**: Spotify (Standard & Extended Lifetime History), YouTube Music Takeout, YouTube (General music), and Apple Music Media Services. *All sources are optional — only 1 required.*
- 📊 **60+ Deep Metrics**:
  - Top 50 Artists & Top 50 Songs
  - 7×24 Day vs. Hour Circadian Density Heatmap
  - 24-Hour Radial Listening Clock
  - Monthly Stream Evolution Area Curves
  - Decade Breakdown (2020s, 2010s, 2000s, 90s)
  - 24-Hour Obsession Index (single-day replay frenzies)
  - Skip Rate Velocity & Completion Ratios
  - Academic Artist H-Index & Sonic Persona Archetypes
- 🎬 **Cinematic Story Mode**: Full-screen 9:16 vertical card sequence (Spotify Wrapped style) with animated reveals, tap navigation, and confetti finale.
- 📱 **Shareable 9:16 Social Cards**: Export Bento Summary, Thermal Supermarket Receipt, or Coachella-style Music Festival Lineup posters for Instagram Stories & TikTok.
- 🎨 **Dual Themes**: Toggle between **Electric Cyber** (acid neons on pitch black) and **Obsidian Glass** (translucent frosted glass on cosmic navy).
- 💻 **Device Telemetry**: Automatically tracks and adapts layout across Mobile, Tablet, Laptop, and Ultrawide monitors.

---

## 🚀 Deploy to Vercel

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MyTaste"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mytaste.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Select your GitHub repository `mytaste`
4. Click **Deploy** (Vite settings are auto-detected with `npm run build` and `dist` output)

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```
