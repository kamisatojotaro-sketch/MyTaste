import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { generateMockHistory } from '../data/mock-data.js';
import { computeMusicStats } from '../utils/stats-calculator.js';
import { unzipArchive } from '../parsers/unzip-helper.js';
import { parseSpotifyFiles } from '../parsers/spotify-parser.js';
import { parseYouTubeFiles } from '../parsers/youtube-parser.js';
import { parseAppleMusicFiles } from '../parsers/apple-parser.js';
import { getSpotifyAccessToken, fetchDirectSpotifyData } from '../services/spotify-api.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [events, setEvents] = useState(() => {
    // Check if user has saved streams in localStorage, otherwise auto-load default rich profile
    const saved = localStorage.getItem('mytaste_events_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return generateMockHistory(); // Auto-load real simulated streams by default!
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [activeSources, setActiveSources] = useState({
    spotify: true,
    youtube_music: true,
    youtube: true,
    apple_music: true
  });

  const [filters, setFilters] = useState({
    platforms: ['spotify', 'youtube_music', 'youtube', 'apple_music'],
    startDate: null,
    endDate: null,
    minDurationMs: 0
  });

  const [viewMode, setViewMode] = useState('dashboard'); // Default straight into dashboard!

  // Check for Spotify OAuth Code on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Clear url params without reload
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setIsLoading(true);
      setLoadingMessage("Connecting directly to Spotify and reading your music...");

      getSpotifyAccessToken(code)
        .then(token => fetchDirectSpotifyData(token))
        .then(directEvents => {
          if (directEvents.length > 0) {
            setEvents(directEvents);
            setIsDemoMode(false);
            setActiveSources({ spotify: true, youtube_music: false, youtube: false, apple_music: false });
            localStorage.setItem('mytaste_events_cache', JSON.stringify(directEvents));
            setViewMode('story');
          }
        })
        .catch(err => {
          console.error("Spotify Auth error:", err);
          alert("Could not connect with Spotify directly. Loading standard data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  // Save events to cache
  useEffect(() => {
    if (events.length > 0 && !isDemoMode) {
      try {
        localStorage.setItem('mytaste_events_cache', JSON.stringify(events));
      } catch (e) {}
    }
  }, [events, isDemoMode]);

  // Load demo dataset
  const loadDemoData = () => {
    setIsLoading(true);
    setLoadingMessage("Loading multi-platform music profile...");
    setTimeout(() => {
      const mock = generateMockHistory();
      setEvents(mock);
      setIsDemoMode(true);
      setActiveSources({
        spotify: true,
        youtube_music: true,
        youtube: true,
        apple_music: true
      });
      setIsLoading(false);
      setViewMode('story');
    }, 400);
  };

  // Ingest raw files
  const processUploadedFiles = async (fileList) => {
    setIsLoading(true);
    setLoadingMessage("Reading files directly in browser memory...");
    
    try {
      let allExtractedFiles = [];
      
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.name.endsWith('.zip')) {
          setLoadingMessage(`Unzipping ${file.name}...`);
          const extracted = await unzipArchive(file);
          allExtractedFiles.push(...extracted);
        } else {
          const text = await file.text();
          allExtractedFiles.push({
            name: file.name,
            content: text
          });
        }
      }

      setLoadingMessage("Aggregating multi-platform streams...");
      
      const spotifyEvents = parseSpotifyFiles(allExtractedFiles);
      const ytEvents = parseYouTubeFiles(allExtractedFiles);
      const appleEvents = parseAppleMusicFiles(allExtractedFiles);

      const combined = [...spotifyEvents, ...ytEvents, ...appleEvents].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      if (combined.length === 0) {
        alert("No valid music listening records found in the provided files.");
        setIsLoading(false);
        return;
      }

      setEvents(combined);
      setIsDemoMode(false);
      setActiveSources({
        spotify: spotifyEvents.length > 0,
        youtube_music: ytEvents.some(e => e.platform === 'youtube_music'),
        youtube: ytEvents.some(e => e.platform === 'youtube'),
        apple_music: appleEvents.length > 0
      });

      setIsLoading(false);
      setViewMode('story');

    } catch (err) {
      console.error("Error processing files:", err);
      alert("Error reading files: " + err.message);
      setIsLoading(false);
    }
  };

  const clearData = () => {
    localStorage.removeItem('mytaste_events_cache');
    const fresh = generateMockHistory();
    setEvents(fresh);
    setIsDemoMode(true);
    setViewMode('dashboard');
  };

  // Compute stats memoized against events and filters
  const stats = useMemo(() => {
    return computeMusicStats(events, filters);
  }, [events, filters]);

  return (
    <DataContext.Provider value={{
      events,
      stats,
      filters,
      setFilters,
      isDemoMode,
      isLoading,
      loadingMessage,
      activeSources,
      viewMode,
      setViewMode,
      loadDemoData,
      processUploadedFiles,
      clearData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
