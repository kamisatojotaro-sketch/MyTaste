import React, { useState } from 'react';
import { useData } from './context/DataContext.jsx';
import Navbar from './components/Header/Navbar.jsx';
import Landing from './components/Landing/Landing.jsx';
import StoryMode from './components/StoryMode/StoryMode.jsx';
import FilterBar from './components/FilterBar/FilterBar.jsx';
import OverviewSection from './components/Dashboard/OverviewSection.jsx';
import ArtistsSection from './components/Dashboard/ArtistsSection.jsx';
import SongsSection from './components/Dashboard/SongsSection.jsx';
import AlbumsSection from './components/Dashboard/AlbumsSection.jsx';
import GenreSection from './components/Dashboard/GenreSection.jsx';
import TemporalSection from './components/Dashboard/TemporalSection.jsx';
import EngagementSection from './components/Dashboard/EngagementSection.jsx';
import CrossPlatformSection from './components/Dashboard/CrossPlatformSection.jsx';
import FunStatsSection from './components/Dashboard/FunStatsSection.jsx';
import RecommendationsSection from './components/Dashboard/RecommendationsSection.jsx';
import UploadModal from './components/Upload/UploadModal.jsx';
import TutorialModal from './components/Tutorial/TutorialModal.jsx';
import ExportCardModal from './components/Modals/ExportCardModal.jsx';
import SettingsModal from './components/Modals/SettingsModal.jsx';

export default function App() {
  const { stats, events, viewMode, setViewMode } = useData();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col antialiased">
      {/* Sticky Header Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'landing' || events.length === 0 ? (
          <Landing
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        ) : (
          <div className="space-y-12 pb-16">
            {/* Global Interactive Filter Bar */}
            <FilterBar />

            {/* 10 Deep Dashboard Sections */}
            <OverviewSection stats={stats} />
            <ArtistsSection stats={stats} />
            <SongsSection stats={stats} />
            <AlbumsSection stats={stats} />
            <GenreSection stats={stats} />
            <TemporalSection stats={stats} />
            <EngagementSection stats={stats} />
            <CrossPlatformSection stats={stats} />
            <FunStatsSection stats={stats} />
            <RecommendationsSection stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-4 text-center text-xs text-[var(--text-muted)] font-mono space-y-1">
        <p>MyTaste — 100% Client-Side Music Intelligence & Recaps</p>
        <p>Zero cloud storage • Spotify • YouTube Music • YouTube • Apple Music</p>
      </footer>

      {/* Wrapped-Style Full-Screen Story Mode */}
      {viewMode === 'story' && (
        <StoryMode onClose={() => setViewMode('dashboard')} />
      )}

      {/* Modals with proper backdrop and centering */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      <TutorialModal
        isOpen={isTutorialOpen || viewMode === 'tutorial'}
        onClose={() => {
          setIsTutorialOpen(false);
          if (viewMode === 'tutorial') setViewMode('story');
        }}
        onComplete={() => {
          if (viewMode === 'tutorial') setViewMode('story');
        }}
      />

      <ExportCardModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />
    </div>
  );
}
