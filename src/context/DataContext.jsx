import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { generateMockHistory } from '../data/mock-data.js';
import { computeMusicStats } from '../utils/stats-calculator.js';
import { unzipArchive } from '../parsers/unzip-helper.js';
import { parseSpotifyFiles } from '../parsers/spotify-parser.js';
import { parseYouTubeFiles } from '../parsers/youtube-parser.js';
import { parseAppleMusicFiles } from '../parsers/apple-parser.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [activeSources, setActiveSources] = useState({
    spotify: false,
    youtube_music: false,
    youtube: false,
    apple_music: false
  });

  const [filters, setFilters] = useState({
    platforms: ['spotify', 'youtube_music', 'youtube', 'apple_music'],
    startDate: null,
    endDate: null,
    minDurationMs: 0
  });

  const [viewMode, setViewMode] = useState('landing'); // 'landing', 'tutorial', 'story', 'dashboard'

  // Load demo dataset
  const loadDemoData = () => {
    setIsLoading(true);
    setLoadingMessage("Generating rich multi-platform listening dataset...");
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
      
      const hasSeenTutorial = localStorage.getItem('mytaste_tutorial_completed');
      if (!hasSeenTutorial) {
        setViewMode('tutorial');
      } else {
        setViewMode('story');
      }
    }, 600);
  };

  // Ingest raw files (ZIP, JSON, CSV, HTML)
  const processUploadedFiles = async (fileList) => {
    setIsLoading(true);
    setLoadingMessage("Decompressing and parsing your files in browser memory...");
    
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

      setLoadingMessage("Normalizing data streams and calculating metrics...");
      
      const spotifyEvents = parseSpotifyFiles(allExtractedFiles);
      const ytEvents = parseYouTubeFiles(allExtractedFiles);
      const appleEvents = parseAppleMusicFiles(allExtractedFiles);

      const combined = [...spotifyEvents, ...ytEvents, ...appleEvents].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      if (combined.length === 0) {
        alert("No valid music listening records found in the provided files. Please ensure you uploaded Spotify, YouTube Takeout, or Apple Music exports.");
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
      
      const hasSeenTutorial = localStorage.getItem('mytaste_tutorial_completed');
      if (!hasSeenTutorial) {
        setViewMode('tutorial');
      } else {
        setViewMode('story');
      }

    } catch (err) {
      console.error("Error processing files:", err);
      alert("An error occurred while reading your files: " + err.message);
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setEvents([]);
    setIsDemoMode(false);
    setViewMode('landing');
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
