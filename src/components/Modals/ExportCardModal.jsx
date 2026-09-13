import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext.jsx';
import html2canvas from 'html2canvas';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileText, 
  Flame, 
  Trophy, 
  Music 
} from 'lucide-react';

/**
 * Generates a CSS polygon clip-path string for an authentic perforated zigzag receipt bottom edge
 */
function getZigzagClipPath(teeth = 26, toothHeight = 10) {
  const points = ['0% 0%', '100% 0%', `100% calc(100% - ${toothHeight}px)`];
  for (let i = teeth; i >= 0; i--) {
    const x = ((i / teeth) * 100).toFixed(2);
    const y = i % 2 === 0 ? '100%' : `calc(100% - ${toothHeight}px)`;
    points.push(`${x}% ${y}`);
  }
  return `polygon(${points.join(', ')})`;
}

const ZIGZAG_CLIP_PATH = getZigzagClipPath(26, 10);

/**
 * Authentic Thermal Receipt Barcode rendered via crisp CSS bars
 */
function ThermalBarcode() {
  const barPattern = [
    2, 1, 3, 1, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 1, 3, 2, 4,
    1, 2, 3, 1, 4, 2, 1, 3, 1, 1, 2, 4, 3, 1, 2, 1, 3, 2, 1, 4,
    2, 1, 3, 1, 2, 4, 1, 3
  ];

  return (
    <div className="flex flex-col items-center gap-1 pt-1 select-none">
      <div className="flex items-end justify-center h-8 gap-[1.5px] w-full max-w-[230px]">
        {barPattern.map((w, idx) => (
          <div
            key={idx}
            className="bg-[#18181B] h-full shrink-0"
            style={{ width: `${w * 1.4}px` }}
          />
        ))}
      </div>
      <span className="text-[9px] font-mono tracking-[0.25em] text-[#333333]">
        * 2 0 2 6 0 9 1 4 8 2 9 1 *
      </span>
    </div>
  );
}

export default function ExportCardModal({ isOpen, onClose }) {
  const { stats } = useData();
  const [template, setTemplate] = useState('bento'); // 'bento' | 'receipt' | 'festival'
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !stats) return null;

  // Safe data extraction
  const topArtists = stats.topArtistsByPlays || [];
  const topTracks = stats.topTracks || stats.topTracksByPlays || [];
  const headliner = topArtists[0]?.name || "Special Guest";
  const subHeadliners = topArtists.slice(1, 3).map(a => a.name).join(' • ') || "Featured Artists";
  const midCard = topArtists.slice(3, 8).map(a => a.name).join(' • ') || "Supporting Acts";
  const underCard = topArtists.slice(8, 16).map(a => a.name).join(' • ');

  const captureCanvas = async () => {
    if (!cardRef.current) return null;
    return await html2canvas(cardRef.current, {
      scale: 3, // High-resolution capture for ultra-crisp text on mobile & stories
      useCORS: true,
      backgroundColor: null, // Preserves transparency around rounded corners and clip-path
      logging: false,
      allowTaint: true,
    });
  };

  const handleDownload = async () => {
    if (isExporting || !cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `MyTaste-${template === 'bento' ? 'Bento-Wrap' : template === 'receipt' ? 'Thermal-Receipt' : 'Festival-Lineup'}-2026.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (isCopying || !cardRef.current) return;
    setIsCopying(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;

      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            handleDownload();
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch (clipErr) {
            console.warn("Direct clipboard write failed, triggering download:", clipErr);
            handleDownload();
          }
        }, 'image/png');
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error("Copy error:", err);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-2xl p-5 sm:p-7 relative border-white/20 shadow-2xl max-h-[92vh] flex flex-col justify-between overflow-y-auto space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="section-label">EXPORT & SHARE</span>
          <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
            Export Shareable Story Card
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Optimized in 9:16 vertical aspect ratio for Instagram Stories, TikTok, and X.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTemplate('bento')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
              template === 'bento'
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20'
                : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bento Wrap</span>
          </button>

          <button
            onClick={() => setTemplate('receipt')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
              template === 'receipt'
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20'
                : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Thermal Receipt</span>
          </button>

          <button
            onClick={() => setTemplate('festival')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
              template === 'festival'
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20'
                : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Festival Lineup</span>
          </button>
        </div>

        {/* Live 9:16 Card Canvas Container */}
        <div className="flex justify-center py-1 sm:py-2">
          <div
            ref={cardRef}
            className="w-[330px] sm:w-[350px] aspect-[9/16] relative shrink-0 shadow-2xl select-none"
            style={{
              clipPath: template === 'receipt' ? ZIGZAG_CLIP_PATH : undefined
            }}
          >
            {/* ═════════════════════════════════════════════════════════
                TEMPLATE 1: BENTO WRAP (Spotify Wrapped Modular Modern)
               ═════════════════════════════════════════════════════════ */}
            {template === 'bento' && (
              <div 
                className="w-full h-full p-5 rounded-3xl border border-white/15 flex flex-col justify-between text-white overflow-hidden relative"
                style={{
                  background: 'radial-gradient(circle at 85% 10%, rgba(138,43,226,0.25), transparent 50%), radial-gradient(circle at 15% 85%, rgba(0,255,163,0.2), transparent 50%), #090B10'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-black font-extrabold text-[11px] shadow-sm">
                      MT
                    </div>
                    <span className="font-display font-extrabold text-sm tracking-tight text-white">MyTaste</span>
                  </div>
                  <span className="badge-neon !text-[9px] !py-0.5 !px-2.5">2026 WRAPPED</span>
                </div>

                {/* Hero Stat: Hours Listened */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md relative overflow-hidden">
                  <span className="text-[9px] uppercase font-mono text-[var(--text-muted)] tracking-wider font-semibold">
                    Hours Listened
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h2 className="font-stat text-5xl leading-none text-gradient-primary">
                      {stats.totalHours}
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--accent-cyan)] font-bold">HRS</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono mt-1 pt-1 border-t border-white/5">
                    <span>{Number(stats.totalStreams).toLocaleString()} total streams</span>
                    <span>{stats.uniqueArtists || topArtists.length} artists</span>
                  </div>
                </div>

                {/* Dual Bento: Top Artist & Persona */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Top Artist */}
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[var(--accent-primary)] uppercase font-bold tracking-wider">
                          #1 Artist
                        </span>
                        <Trophy className="w-3 h-3 text-[var(--accent-primary)]" />
                      </div>
                      <p className="font-display font-bold text-xs text-white mt-1.5 truncate">
                        {topArtists[0]?.name || "Various Artists"}
                      </p>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                      {topArtists[0]?.plays ? `${topArtists[0].plays} plays` : ""}
                    </p>
                  </div>

                  {/* Sonic Persona */}
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[var(--accent-secondary)] uppercase font-bold tracking-wider">
                          Persona
                        </span>
                        <Sparkles className="w-3 h-3 text-[var(--accent-secondary)]" />
                      </div>
                      <p className="font-display font-bold text-xs text-white mt-1.5 leading-tight line-clamp-2">
                        {stats.funStats?.personality || "The Sonic Explorer"}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--accent-cyan)] font-semibold truncate mt-1">
                      {stats.funStats?.topGenre || "Eclectic Mix"}
                    </span>
                  </div>
                </div>

                {/* Top Tracks Heavy Rotation */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase text-[var(--accent-cyan)] font-bold tracking-wider">
                      Heavy Rotation
                    </span>
                    <Music className="w-3 h-3 text-[var(--accent-cyan)]" />
                  </div>
                  {topTracks.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={`font-mono text-[10px] font-bold w-3.5 shrink-0 ${
                          i === 0 ? 'text-[#FFD700]' : i === 1 ? 'text-[#00F5D4]' : i === 2 ? 'text-[#00FFA3]' : 'text-[var(--text-muted)]'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="truncate">
                          <p className="font-medium text-[11px] text-white truncate leading-tight">{t.title}</p>
                          <p className="text-[9px] text-[var(--text-muted)] truncate leading-tight">{t.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] shrink-0 font-medium">
                        {t.plays}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[9px] text-[var(--text-muted)] font-mono">
                  <span>mytaste.app // Client-Side Privacy</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse"></span>
                    <span className="w-1 h-3 bg-[var(--accent-cyan)] rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-1.5 bg-[var(--accent-secondary)] rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                TEMPLATE 2: THERMAL RECEIPT (Authentic Grocery Paper)
               ═════════════════════════════════════════════════════════ */}
            {template === 'receipt' && (
              <div 
                className="w-full h-full bg-[#F4F4F0] text-[#18181B] p-5 pb-7 flex flex-col justify-between text-left select-none"
                style={{
                  fontFamily: "'Space Mono', 'Courier New', Courier, 'JetBrains Mono', monospace",
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
                }}
              >
                {/* Receipt Header */}
                <div className="text-center space-y-0.5">
                  <p className="font-bold text-[13px] tracking-wider text-[#111111]">*** MYTASTE AUDIO MART ***</p>
                  <p className="text-[9px] text-[#444444] tracking-tight">100% CLIENT-SIDE MUSIC STORE</p>
                  <p className="text-[9px] text-[#444444]">STORE #2026 // TERM #01 // REG #04</p>
                  <p className="text-[9px] text-[#555555]">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="border-b border-dashed border-[#18181B]/40 my-1"></div>

                {/* Column Headers */}
                <div className="flex justify-between text-[10px] font-bold text-[#222222] px-0.5">
                  <span>QTY  DESCRIPTION</span>
                  <span>PLAYS</span>
                </div>

                <div className="border-b border-dashed border-[#18181B]/30 mb-1"></div>

                {/* Line Items: Top Tracks */}
                <div className="space-y-1 my-auto">
                  {topTracks.slice(0, 6).map((t, i) => (
                    <div key={i} className="flex justify-between text-[10px] leading-snug">
                      <div className="truncate pr-2 max-w-[215px]">
                        <span className="font-bold">{String(i + 1).padStart(2, '0')} </span>
                        <span className="font-semibold text-[#111111]">{t.title}</span>
                        <span className="text-[#666666] block text-[9px] pl-5 truncate">- {t.artist}</span>
                      </div>
                      <span className="font-bold text-[#111111] shrink-0 pt-0.5">
                        {t.plays}x
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-[#18181B]/40 pt-1.5 space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>ITEM COUNT:</span>
                    <span className="font-bold">{stats.totalStreams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TOTAL ARTISTS:</span>
                    <span className="font-bold">{stats.uniqueArtists || topArtists.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TOP GENRE:</span>
                    <span className="font-bold uppercase">{stats.funStats?.topGenre || "ECLECTIC"}</span>
                  </div>
                  <div className="flex justify-between text-[#555555]">
                    <span>TAX (VIBES):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-dashed border-[#18181B]/50 my-1"></div>
                  <div className="flex justify-between font-extrabold text-[12px] text-[#000000]">
                    <span>TOTAL HOURS:</span>
                    <span>{stats.totalHours} HRS</span>
                  </div>
                </div>

                {/* Payment & Persona Info */}
                <div className="border-t border-dashed border-[#18181B]/30 pt-1 text-[9px] text-[#444444] space-y-0.5">
                  <p><span className="font-bold text-[#111111]">PAYMENT:</span> 100% PRIVATE IN-BROWSER</p>
                  <p><span className="font-bold text-[#111111]">AUTH CODE:</span> APPROVED_MT2026</p>
                  <p className="truncate"><span className="font-bold text-[#111111]">ARCHETYPE:</span> {stats.funStats?.personality || "THE SONIC EXPLORER"}</p>
                </div>

                {/* Barcode & Store Message */}
                <div className="text-center pt-1 border-t border-dashed border-[#18181B]/40">
                  <ThermalBarcode />
                  <p className="text-[9px] font-bold text-[#222222] tracking-wider mt-1">
                    THANK YOU FOR LISTENING!
                  </p>
                  <p className="text-[8px] text-[#666666]">
                    HTTPS://MYTASTE.APP
                  </p>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                TEMPLATE 3: FESTIVAL LINEUP (Coachella Dark Desert Night)
               ═════════════════════════════════════════════════════════ */}
            {template === 'festival' && (
              <div 
                className="w-full h-full p-5 rounded-3xl border border-white/20 flex flex-col justify-between text-center overflow-hidden relative select-none"
                style={{
                  background: 'radial-gradient(circle at 50% 12%, rgba(138,43,226,0.35), transparent 50%), radial-gradient(circle at 50% 95%, rgba(255,107,0,0.22), transparent 55%), linear-gradient(180deg, #090514 0%, #130A24 35%, #1C0F35 65%, #0B0616 100%)'
                }}
              >
                {/* Coachella Top Vintage Banner */}
                <div className="space-y-1 border-b border-white/15 pb-2.5">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[8px] font-mono tracking-[0.25em] text-[#FFE27D] uppercase font-bold">
                      ★ GOLDENVOICE & MYTASTE PRESENT ★
                    </span>
                  </div>
                  
                  {/* Festival Grand Title */}
                  <h1 className="font-stat text-[42px] leading-none tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#FFCA66] to-[#FF7B00] drop-shadow-[0_4px_16px_rgba(255,140,0,0.35)]">
                    MYTASTE FEST
                  </h1>

                  <div className="inline-block px-3 py-0.5 rounded-full bg-white/10 border border-amber-400/30">
                    <p className="text-[8px] font-mono text-amber-200 tracking-[0.2em] uppercase font-bold">
                      OCTOBER 23-25, 2026 • EMPIRE POLO CLUB • INDIO, CA
                    </p>
                  </div>
                </div>

                {/* Lineup Tier 1: Headliner (Bebas Neue 52px) */}
                <div className="py-1">
                  <span className="inline-block text-[8px] font-mono uppercase tracking-[0.3em] text-[#00FFA3] font-bold mb-0.5">
                    ━ MAIN STAGE // HEADLINER ━
                  </span>
                  <h2 className="font-stat text-[46px] sm:text-[52px] leading-[0.9] text-white tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                    {headliner}
                  </h2>
                </div>

                {/* Lineup Tier 2: Sub-Headliners */}
                <div className="py-1">
                  <span className="inline-block text-[8px] font-mono uppercase tracking-[0.25em] text-amber-300 font-bold mb-0.5">
                    ━ OUTDOOR THEATRE • SAHARA TENT ━
                  </span>
                  <h3 className="font-stat text-[24px] sm:text-[27px] leading-tight tracking-wide uppercase text-[var(--accent-primary)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {subHeadliners}
                  </h3>
                </div>

                {/* Lineup Tier 3: Mid-Card Acts */}
                <div className="py-1 px-1">
                  <span className="inline-block text-[7.5px] font-mono uppercase tracking-[0.25em] text-purple-300 font-bold mb-0.5">
                    ━ MOJAVE • GOBI • YUMA ━
                  </span>
                  <p className="font-stat text-[15px] sm:text-[17px] leading-snug tracking-wider uppercase text-slate-200">
                    {midCard}
                  </p>
                </div>

                {/* Lineup Tier 4: Undercard Acts */}
                {underCard && (
                  <div className="px-2 py-0.5">
                    <span className="inline-block text-[7px] font-mono uppercase tracking-[0.2em] text-slate-400 font-medium mb-0.5">
                      ━ SONORA • HEINEKEN HOUSE • DESERT DOME ━
                    </span>
                    <p className="font-display font-semibold text-[9.5px] sm:text-[10.5px] leading-relaxed tracking-[0.14em] uppercase text-slate-400">
                      {underCard}
                    </p>
                  </div>
                )}

                {/* Coachella Festival Footer Banner */}
                <div className="border-t border-white/15 pt-2 text-[8px] font-mono text-slate-300 tracking-wider space-y-0.5">
                  <p className="text-amber-200/90 font-bold">
                    CAMPING • ART INSTALLATIONS • CURATED BY YOUR AUDIO DNA
                  </p>
                  <p className="text-slate-400">
                    MYTASTE.APP // OFFICIAL FESTIVAL ROSTER // ALL AGES
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <p className="text-xs text-[var(--text-muted)] text-center sm:text-left">
            Ready to post to Stories, TikTok, or send to friends.
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopyImage}
              disabled={isCopying || isExporting}
              className="btn-secondary !py-2.5 !px-4 text-xs flex-1 sm:flex-initial"
              title="Copy card image to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-[var(--accent-primary)] font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isCopying ? "Copying..." : "Copy Image"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting || isCopying}
              className="btn-primary !py-2.5 !px-5 text-xs flex-1 sm:flex-initial"
              title="Download high-resolution 9:16 PNG"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Rendering 9:16 PNG..." : "Download PNG"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
