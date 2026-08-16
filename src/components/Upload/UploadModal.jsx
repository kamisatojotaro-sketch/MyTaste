import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext.jsx';
import { 
  X, 
  UploadCloud, 
  FileArchive, 
  FileJson, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onOpenTutorial }) {
  const { processUploadedFiles, isLoading, loadingMessage, loadDemoData } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    await processUploadedFiles(selectedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--accent-primary)] mb-2">
            <span>100% Client-Side • Zero Cloud Uploads</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Upload Your Music Data
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Drop your Spotify, YouTube Takeout, or Apple Music exports (.zip, .json, .csv, .html).
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive 
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 scale-[1.01]' 
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.json,.csv,.html"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-cyan)] flex items-center justify-center text-black shadow-lg shadow-[var(--accent-primary)]/20">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="font-bold text-sm sm:text-base text-white">
              {dragActive ? "Drop files now" : "Click to select or drag & drop files here"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Supports Spotify (.zip/endsong.json), Google Takeout (.zip/watch-history.json), and Apple Music (.csv)
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Selected Files ({selectedFiles.length}):
            </p>
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-2 truncate">
                  {file.name.endsWith('.zip') ? <FileArchive className="w-4 h-4 text-amber-400 shrink-0" /> : <FileJson className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span className="text-white truncate font-mono">{file.name}</span>
                </div>
                <span className="text-[var(--text-muted)] text-[10px] shrink-0 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => { onClose(); onOpenTutorial(); }}
            className="text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need help getting your data?</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => { loadDemoData(); onClose(); }}
              className="btn-secondary !py-2.5 !px-4 text-xs w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Use Sample Data</span>
            </button>

            <button
              onClick={handleProcess}
              disabled={selectedFiles.length === 0 || isLoading}
              className="btn-primary !py-2.5 !px-6 text-xs w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span>Analyze Music</span>
              )}
            </button>
          </div>
        </div>

        {/* Loading overlay indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--accent-primary)] border-t-transparent animate-spin" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg text-white">Analyzing Your Music</h4>
              <p className="text-xs text-[var(--text-secondary)] font-mono">{loadingMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
