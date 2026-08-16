import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext.jsx';
import html2canvas from 'html2canvas';
import { X, Download, Sparkles, Check, Share2 } from 'lucide-react';

export default function ExportCardModal({ isOpen, onClose }) {
  const { stats } = useData();
  const [template, setTemplate] = useState('bento'); // 'bento', 'receipt', 'festival'
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !stats) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#08090D',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `MyTaste-${template}-Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-display font-bold text-2xl text-white">
            Export Shareable Story Card
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Optimized in 9:16 vertical aspect ratio for Instagram Stories, TikTok & X.
          </p>
        </div>

        {/* Template Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplate('bento')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              template === 'bento' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            Bento Grid
          </button>
          <button
            onClick={() => setTemplate('receipt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              template === 'receipt' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            Thermal Receipt
          </button>
          <button
            onClick={() => setTemplate('festival')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              template === 'festival' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            Festival Lineup
          </button>
        </div>

        {/* Card Preview Container (9:16) */}
        <div className="flex justify-center py-2">
          <div 
            ref={cardRef} 
            className="w-full max-w-[340px] aspect-[9/16] p-6 rounded-3xl bg-[#08090D] border border-white/20 shadow-2xl flex flex-col justify-between text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-black font-bold text-xs">
                  MT
                </div>
                <span className="font-display font-bold text-sm">MyTaste</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase">2026 Recap</span>
            </div>

            {/* Template Body */}
            {template === 'bento' && (
              <div className="space-y-4 my-auto">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--text-muted)]">Hours Listened</span>
                  <h2 className="font-display font-black text-5xl text-[var(--accent-primary)]">{stats.totalHours}</h2>
                  <p className="text-xs text-[var(--text-secondary)]">{stats.totalStreams.toLocaleString()} total streams</p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-left">
                  <span className="text-[10px] font-mono uppercase text-[var(--accent-cyan)] font-bold">Top Artists</span>
                  {stats.topArtistsByPlays.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex justify-between text-xs font-medium">
                      <span className="truncate">{i + 1}. {a.name}</span>
                      <span className="text-[var(--text-muted)] font-mono">{a.plays}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-[var(--accent-secondary)] uppercase font-bold">Persona</span>
                  <p className="font-display font-bold text-xs text-white">{stats.funStats.personality}</p>
                </div>
              </div>
            )}

            {template === 'receipt' && (
              <div className="font-mono text-xs space-y-3 my-auto text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-center border-b border-dashed border-white/20 pb-2">
                  <p className="font-bold text-sm tracking-widest">MYTASTE ORDER #2026</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="space-y-1.5">
                  {stats.topTracks.slice(0, 7).map((t, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span className="truncate w-40">{t.title}</span>
                      <span>${(t.plays * 0.04).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-white/20 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>ITEM COUNT:</span>
                    <span>{stats.totalStreams}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[var(--accent-primary)]">
                    <span>TOTAL HOURS:</span>
                    <span>{stats.totalHours}</span>
                  </div>
                </div>
              </div>
            )}

            {template === 'festival' && (
              <div className="space-y-3 my-auto text-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[var(--accent-secondary)]">Presents</span>
                  <h3 className="font-display font-black text-2xl text-[var(--accent-primary)] tracking-tight">MYTASTE FEST</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">LIVE IN CONCERT</p>
                </div>

                <div className="space-y-2 py-2">
                  <p className="font-display font-black text-xl text-white tracking-wide">
                    {stats.topArtistsByPlays[0]?.name}
                  </p>
                  <p className="font-display font-bold text-base text-[var(--accent-cyan)]">
                    {stats.topArtistsByPlays.slice(1, 3).map(a => a.name).join(' • ')}
                  </p>
                  <p className="font-display font-medium text-xs text-[var(--text-secondary)]">
                    {stats.topArtistsByPlays.slice(3, 8).map(a => a.name).join(' • ')}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-white/10 pt-2 text-center text-[10px] text-[var(--text-muted)] font-mono">
              mytaste.app • 100% Client-Side Intelligence
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="btn-primary !py-2.5 !px-6 text-xs w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Rendering Image..." : "Download 9:16 PNG"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
